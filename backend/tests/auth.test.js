const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  // Set NODE_ENV to test to suppress logs and prevent port listening
  process.env.NODE_ENV = 'test';
  process.env.JWT_ACCESS_SECRET = 'test_access_secret_12345_67890';
  process.env.JWT_REFRESH_SECRET = 'test_refresh_secret_12345_67890';
  
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clean users collection before each test
  await User.deleteMany({});
});

describe('🔐 Auth Integration Test Suite', () => {
  const testUser = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Password123!',
  };

  describe('📥 POST /api/auth/signup', () => {
    it('should successfully register a new user and return an access token & HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.name).toBe(testUser.name);
      expect(res.body.user.email).toBe(testUser.email);
      
      // Verify refresh cookie was set
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toMatch(/refreshToken=/);
      expect(cookies[0]).toMatch(/HttpOnly/);
      
      // Verify user was saved in DB
      const user = await User.findOne({ email: testUser.email });
      expect(user).toBeTruthy();
      expect(user.refreshTokens.length).toBe(1);
    });

    it('should fail registration if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ email: testUser.email });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should fail if email is already registered', async () => {
      // Create first user
      await request(app).post('/api/auth/signup').send(testUser);
      
      // Attempt to register again
      const res = await request(app).post('/api/auth/signup').send(testUser);
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/);
    });
  });

  describe('🔑 POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register the user
      await request(app).post('/api/auth/signup').send(testUser);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe(testUser.email);
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid credentials/);
    });
  });

  describe('🔄 POST /api/auth/refresh-token', () => {
    it('should issue a new access token when a valid refresh token cookie is supplied', async () => {
      // Register
      const signupRes = await request(app).post('/api/auth/signup').send(testUser);
      const cookies = signupRes.headers['set-cookie'];

      // Perform refresh request sending back the cookie
      const res = await request(app)
        .post('/api/auth/refresh-token')
        .set('Cookie', cookies);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.accessToken).toBeDefined();
    });

    it('should return 401 when no refresh token cookie is provided', async () => {
      const res = await request(app).post('/api/auth/refresh-token');
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('📤 POST /api/auth/logout', () => {
    it('should successfully clear cookie and clean DB refresh token sessions', async () => {
      // Register
      const signupRes = await request(app).post('/api/auth/signup').send(testUser);
      const cookies = signupRes.headers['set-cookie'];

      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies);

      expect(logoutRes.statusCode).toBe(200);
      
      // Verify DB refresh token array is empty
      const dbUser = await User.findOne({ email: testUser.email });
      expect(dbUser.refreshTokens.length).toBe(0);
    });
  });

  describe('📨 Password Reset Flow (Forgot & Reset)', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send(testUser);
    });

    it('should generate secure code and email it, then permit reset and invalidate token', async () => {
      // 1. Forgot password request
      const forgotRes = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: testUser.email });

      expect(forgotRes.statusCode).toBe(200);
      expect(forgotRes.body.success).toBe(true);
      
      // Since NODE_ENV !== production, it returns the devCode in JSON for easy assertion
      const devCode = forgotRes.body.devCode;
      expect(devCode).toBeDefined();

      // Retrieve user from DB to verify codes are stored
      const dbUser = await User.findOne({ email: testUser.email });
      expect(dbUser.resetPasswordCode).toBe(devCode);
      expect(dbUser.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());

      // 2. Perform password reset using the 6-digit code
      const newPassword = 'MyBrandNewPassword123!';
      const resetRes = await request(app)
        .post('/api/auth/reset-password')
        .send({
          email: testUser.email,
          code: devCode,
          password: newPassword,
        });

      expect(resetRes.statusCode).toBe(200);
      expect(resetRes.body.success).toBe(true);

      // Verify DB cleared codes and reset token
      const updatedUser = await User.findOne({ email: testUser.email });
      expect(updatedUser.resetPasswordCode).toBeUndefined();
      expect(updatedUser.resetPasswordExpires).toBeUndefined();

      // 3. Test logging in with the new password
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: newPassword,
        });
      
      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body.success).toBe(true);
    });
  });
});
