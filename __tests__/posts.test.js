const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/utils/github.js');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('makes a post as long as you are logged in', async () => {
    const agent = request.agent(app);

    await agent
      .get('/api/v1/github/login/callback?code=MOCK_CODE')
      .redirects(1);

    return agent
      .post('/api/v1/posts')
      .send({ text: 'yoyo im kaing a tweet' })
      .then((res) => {
        expect(res.body).toEqual({
          id: expect.any(String),
          text: 'yoyo im kaing a tweet',
          username: 'fake_github_user',
        });
      });
  });
  it('gets a list of all the gittys', async () => {
    const agent = request.agent(app);

    await agent
      .get('/api/v1/github/login/callback?code=MOCK_CODE')
      .redirects(1);

    await agent
      .post('/api/v1/posts')
      .send({ text: 'here is another test gitty' });

    const response = await agent.get('/api/v1/posts');

    expect(response.body).toEqual([
      {
        id: expect.any(String),
        text: 'here is another test gitty',
        username: 'fake_github_user',
      },
    ]);
  });
});
