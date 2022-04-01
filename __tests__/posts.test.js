const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');

jest.mock('../lib/middleware/auth.js', () => {
  return (req, res, next) => {
    req.user = {
      email: 'not-real@example.com',
      username: 'fake_github_user',
      avatar: 'https://www.placecage.com/gif/300/300',
    };
    next();
  };
});

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('makes a post as long as you are logged in', async () => {
    await GithubUser.insert({
      username: 'fake_github_user',
      avatar: 'https://www.placecage.com/gif/300/300',
    });

    return await request(app)
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
    await GithubUser.insert({
      username: 'fake_github_user',
      avatar: 'https://www.placecage.com/gif/300/300',
    });

    await request(app)
      .post('/api/v1/posts')
      .send({ text: 'here is another test gitty' });

    const response = await request(app).get('/api/v1/posts');

    expect(response.body).toEqual([
      {
        id: expect.any(String),
        text: 'here is another test gitty',
        username: 'fake_github_user',
      },
    ]);
  });
});
