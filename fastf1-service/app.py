"""
FastF1 Microservice — Flask server wrapping the FastF1 library
to serve historical Formula 1 race data on port 5001.
"""

import os
import math
import traceback

import numpy as np
import pandas as pd
import fastf1
from flask import Flask, request, jsonify
from flask_cors import CORS

# ──────────────────────────────────────────────
# App setup
# ──────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

CACHE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".fastf1-cache")
os.makedirs(CACHE_DIR, exist_ok=True)
fastf1.Cache.enable_cache(CACHE_DIR)


# ──────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────
def _clean(value):
    """Convert pandas / numpy types into JSON-safe Python types."""
    if value is None or pd.isna(value):
        return None
    if isinstance(value, pd.Timedelta):
        if pd.isna(value):
            return None
        return str(value)
    if isinstance(value, pd.Timestamp):
        if pd.isna(value):
            return None
        return value.isoformat()
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        if np.isnan(value):
            return None
        return float(value)
    if isinstance(value, (np.bool_,)):
        return bool(value)
    if isinstance(value, float) and math.isnan(value):
        return None
    return value


def _clean_dict(d: dict) -> dict:
    """Apply _clean to every value in a dict."""
    return {k: _clean(v) for k, v in d.items()}


def _td_to_str(td):
    """Format a Timedelta nicely (mm:ss.fff) or return None."""
    if pd.isna(td):
        return None
    total_seconds = td.total_seconds()
    minutes = int(total_seconds // 60)
    seconds = total_seconds % 60
    return f"{minutes}:{seconds:06.3f}"


def _get_int_param(name, default=None, required=False):
    """Pull an integer query-param or abort with a clear message."""
    raw = request.args.get(name)
    if raw is None:
        if required:
            raise ValueError(f"Missing required parameter: {name}")
        return default
    try:
        return int(raw)
    except ValueError:
        raise ValueError(f"Parameter '{name}' must be an integer, got '{raw}'")


def _load_session(year, round_number, session_type, **load_kwargs):
    """Load a FastF1 session with caching."""
    session = fastf1.get_session(year, round_number, session_type)
    session.load(**load_kwargs)
    return session


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.route("/health")
def health():
    return jsonify({"status": "ok", "service": "fastf1-service"})


# ── Session results ──────────────────────────
@app.route("/api/f1/session")
def session_results():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)
        session_type = request.args.get("session", "Race")

        session = _load_session(
            year, round_number, session_type,
            telemetry=False, weather=True, messages=True,
        )

        # --- results ---
        results = []
        if session.results is not None and not session.results.empty:
            for _, row in session.results.iterrows():
                results.append(_clean_dict({
                    "position": row.get("Position"),
                    "driver_number": row.get("DriverNumber"),
                    "abbreviation": row.get("Abbreviation"),
                    "full_name": row.get("FullName",
                                         f"{row.get('FirstName', '')} {row.get('LastName', '')}".strip()),
                    "team_name": row.get("TeamName"),
                    "team_color": row.get("TeamColor"),
                    "grid_position": row.get("GridPosition"),
                    "status": row.get("Status"),
                    "time": _td_to_str(row.get("Time")) if isinstance(row.get("Time"), pd.Timedelta) else _clean(row.get("Time")),
                    "points": row.get("Points"),
                }))

        # --- weather ---
        weather = None
        if hasattr(session, "weather_data") and session.weather_data is not None and not session.weather_data.empty:
            # Take the median / most-common weather readings
            w = session.weather_data
            weather = _clean_dict({
                "air_temp": w["AirTemp"].median() if "AirTemp" in w.columns else None,
                "track_temp": w["TrackTemp"].median() if "TrackTemp" in w.columns else None,
                "humidity": w["Humidity"].median() if "Humidity" in w.columns else None,
                "wind_speed": w["WindSpeed"].median() if "WindSpeed" in w.columns else None,
                "rainfall": bool(w["Rainfall"].any()) if "Rainfall" in w.columns else None,
            })

        return jsonify({
            "results": results,
            "weather": weather,
            "event_name": session.event["EventName"] if hasattr(session, "event") else None,
            "session_type": session_type,
            "date": session.date.isoformat() if hasattr(session, "date") and session.date else None,
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Lap data ─────────────────────────────────
@app.route("/api/f1/laps")
def laps():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)
        session_type = request.args.get("session", "Race")
        driver = request.args.get("driver")  # optional abbreviation

        session = _load_session(
            year, round_number, session_type,
            telemetry=False, weather=False, messages=False,
        )

        lap_data = session.laps
        if driver:
            lap_data = lap_data.pick_drivers(driver)

        result = []
        for _, lap in lap_data.iterrows():
            result.append(_clean_dict({
                "driver_number": lap.get("DriverNumber"),
                "abbreviation": lap.get("Driver"),
                "lap_number": lap.get("LapNumber"),
                "lap_time": _td_to_str(lap.get("LapTime")),
                "sector_1_time": _td_to_str(lap.get("Sector1Time")),
                "sector_2_time": _td_to_str(lap.get("Sector2Time")),
                "sector_3_time": _td_to_str(lap.get("Sector3Time")),
                "compound": lap.get("Compound"),
                "tyre_life": lap.get("TyreLife"),
                "is_pit_out_lap": lap.get("PitOutTime") is not None and not pd.isna(lap.get("PitOutTime")),
                "is_pit_in_lap": lap.get("PitInTime") is not None and not pd.isna(lap.get("PitInTime")),
                "position": lap.get("Position"),
                "stint": lap.get("Stint"),
            }))

        return jsonify(result)

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Track layout ─────────────────────────────
@app.route("/api/f1/track")
def track():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)
        session_type = request.args.get("session", "Race")

        session = _load_session(
            year, round_number, session_type,
            telemetry=True, weather=False, messages=False,
        )

        points = []

        # Strategy 1: circuit_info
        try:
            ci = session.get_circuit_info()
            if ci is not None and hasattr(ci, "corners") and ci.corners is not None:
                # Use corners as waypoints; the full shape comes from telemetry
                pass  # fall through to telemetry approach
        except Exception:
            pass

        # Strategy 2: fastest lap telemetry
        if not points:
            try:
                fastest = session.laps.pick_fastest()
                tel = fastest.get_telemetry()
                if tel is not None and not tel.empty:
                    xs = tel["X"].values
                    ys = tel["Y"].values
                    total = len(xs)
                    # Downsample to ~200 points
                    step = max(1, total // 200)
                    for i in range(0, total, step):
                        x_val = float(xs[i]) if not np.isnan(xs[i]) else None
                        y_val = float(ys[i]) if not np.isnan(ys[i]) else None
                        if x_val is not None and y_val is not None:
                            points.append({"x": x_val, "y": y_val})
            except Exception:
                traceback.print_exc()

        return jsonify({"track": points})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Qualifying ───────────────────────────────
@app.route("/api/f1/qualifying")
def qualifying():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)

        session = _load_session(
            year, round_number, "Qualifying",
            telemetry=False, weather=False, messages=False,
        )

        grid = []
        if session.results is not None and not session.results.empty:
            for _, row in session.results.iterrows():
                grid.append(_clean_dict({
                    "position": row.get("Position"),
                    "driver_number": row.get("DriverNumber"),
                    "abbreviation": row.get("Abbreviation"),
                    "full_name": row.get("FullName",
                                         f"{row.get('FirstName', '')} {row.get('LastName', '')}".strip()),
                    "team_name": row.get("TeamName"),
                    "team_color": row.get("TeamColor"),
                    "q1_time": _td_to_str(row.get("Q1")),
                    "q2_time": _td_to_str(row.get("Q2")),
                    "q3_time": _td_to_str(row.get("Q3")),
                }))

        return jsonify({"qualifying": grid})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Safety Car periods ───────────────────────
@app.route("/api/f1/safety-car")
def safety_car():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)

        session = _load_session(
            year, round_number, "Race",
            telemetry=False, weather=False, messages=True,
        )

        periods = []
        if hasattr(session, "track_status") and session.track_status is not None and not session.track_status.empty:
            ts = session.track_status
            current_period = None

            for _, row in ts.iterrows():
                status = str(row.get("Status", ""))
                message = str(row.get("Message", ""))

                # Status codes: 4 = SC, 6 = VSC
                if status == "4" and current_period is None:
                    current_period = {"type": "SC", "start_time": _clean(row.get("Time"))}
                elif status == "6" and current_period is None:
                    current_period = {"type": "VSC", "start_time": _clean(row.get("Time"))}
                elif status in ("1", "2") and current_period is not None:
                    current_period["end_time"] = _clean(row.get("Time"))
                    periods.append(current_period)
                    current_period = None

            # Close any open period
            if current_period is not None:
                current_period["end_time"] = None
                periods.append(current_period)

        # Try to map times → lap numbers using laps data
        if periods:
            try:
                laps_df = session.laps
                if laps_df is not None and not laps_df.empty:
                    for period in periods:
                        # These are track-status Timedelta offsets; approximate to lap numbers
                        period["start_lap"] = None
                        period["end_lap"] = None
                        start_t = period.pop("start_time", None)
                        end_t = period.pop("end_time", None)

                        if start_t:
                            try:
                                start_td = pd.Timedelta(start_t) if not isinstance(start_t, pd.Timedelta) else start_t
                                mask = laps_df["Time"] >= start_td
                                if mask.any():
                                    period["start_lap"] = int(laps_df.loc[mask].iloc[0]["LapNumber"])
                            except Exception:
                                pass
                        if end_t:
                            try:
                                end_td = pd.Timedelta(end_t) if not isinstance(end_t, pd.Timedelta) else end_t
                                mask = laps_df["Time"] >= end_td
                                if mask.any():
                                    period["end_lap"] = int(laps_df.loc[mask].iloc[0]["LapNumber"])
                            except Exception:
                                pass
                else:
                    for p in periods:
                        p.pop("start_time", None)
                        p.pop("end_time", None)
                        p["start_lap"] = None
                        p["end_lap"] = None
            except Exception:
                for p in periods:
                    p.pop("start_time", None)
                    p.pop("end_time", None)
                    p["start_lap"] = None
                    p["end_lap"] = None

        return jsonify({"safety_car_periods": periods})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── DRS zones ────────────────────────────────
@app.route("/api/f1/drs-zones")
def drs_zones():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)

        session = _load_session(
            year, round_number, "Race",
            telemetry=False, weather=False, messages=False,
        )

        zones = []
        try:
            ci = session.get_circuit_info()
            if ci is not None:
                # marshal_sectors / marshal_lights often carry DRS info
                if hasattr(ci, "marshal_sectors") and ci.marshal_sectors is not None:
                    for _, row in ci.marshal_sectors.iterrows():
                        zones.append(_clean_dict({
                            "distance": row.get("Distance"),
                            "previous": row.get("Previous"),
                            "letter": row.get("Letter"),
                        }))
                # corners
                corners = []
                if hasattr(ci, "corners") and ci.corners is not None:
                    for _, row in ci.corners.iterrows():
                        corners.append(_clean_dict({
                            "number": row.get("Number"),
                            "letter": row.get("Letter"),
                            "angle": row.get("Angle"),
                            "distance": row.get("Distance"),
                        }))
        except Exception:
            traceback.print_exc()

        return jsonify({
            "drs_zones": zones,
            "corners": corners if "corners" in dir() else [],
        })

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ── Pit stops ────────────────────────────────
@app.route("/api/f1/pit-stops")
def pit_stops():
    try:
        year = _get_int_param("year", required=True)
        round_number = _get_int_param("round", required=True)

        session = _load_session(
            year, round_number, "Race",
            telemetry=False, weather=False, messages=False,
        )

        stops = []
        laps_df = session.laps

        if laps_df is not None and not laps_df.empty:
            drivers = laps_df["Driver"].unique()
            for drv in drivers:
                drv_laps = laps_df.pick_drivers(drv).sort_values("LapNumber")

                for idx in range(len(drv_laps)):
                    lap = drv_laps.iloc[idx]

                    is_pit_in = (lap.get("PitInTime") is not None
                                 and not pd.isna(lap.get("PitInTime")))
                    if not is_pit_in:
                        continue

                    pit_duration = None
                    if (lap.get("PitOutTime") is not None
                            and not pd.isna(lap.get("PitOutTime"))
                            and lap.get("PitInTime") is not None
                            and not pd.isna(lap.get("PitInTime"))):
                        pit_duration = _td_to_str(lap["PitOutTime"] - lap["PitInTime"])

                    # If pit-out is on the *next* lap, compute from that
                    if pit_duration is None and idx + 1 < len(drv_laps):
                        next_lap = drv_laps.iloc[idx + 1]
                        if (next_lap.get("PitOutTime") is not None
                                and not pd.isna(next_lap.get("PitOutTime"))):
                            pit_duration = _td_to_str(
                                next_lap["PitOutTime"] - lap["PitInTime"]
                            )

                    compound_before = _clean(lap.get("Compound"))
                    compound_after = None
                    if idx + 1 < len(drv_laps):
                        compound_after = _clean(drv_laps.iloc[idx + 1].get("Compound"))

                    stops.append(_clean_dict({
                        "driver_number": lap.get("DriverNumber"),
                        "abbreviation": lap.get("Driver"),
                        "lap": lap.get("LapNumber"),
                        "pit_duration": pit_duration,
                        "compound_before": compound_before,
                        "compound_after": compound_after,
                    }))

        return jsonify({"pit_stops": stops})

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ──────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────
if __name__ == "__main__":
    print("FastF1 Service starting on http://localhost:5001")
    app.run(host="0.0.0.0", port=5001, debug=True)
