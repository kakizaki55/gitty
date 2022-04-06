const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/utils/github');

const mockUser = {
  username: 'my name',
  email: 'someemail@gmail.com',
};

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('should redirect to the github oauth page upon login', async () => {
    const req = await request(app).get('/api/v1/github/login');

    expect(req.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/login\/callback/i
    );
  });

  it('should login and redirect users to /api/v1/posts', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/login/callback?code=42')
      .redirects(1);

    console.log('req.location', res.redirects);

    expect(res.redirects[0]).toContain(`/api/v1/posts`);
  });
  it('deletes user on the delete route for user', async () => {
    const agent = request.agent(app);
    await GithubUser.insert(mockUser);

    await agent.post('/api/v1/github/login').send();
    const signOutResponse = await agent.delete('/api/v1/github');

    expect(signOutResponse.body).toEqual({
      success: true,
      message: 'Signed out successfully!',
    });
  });
});
