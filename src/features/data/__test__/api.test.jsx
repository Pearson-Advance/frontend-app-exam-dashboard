import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

import { updateUserData, getExams } from '../api';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: jest.fn(),
}));

describe('API service', () => {
  const mockHttpClient = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    getConfig.mockReturnValue({
      WEBNG_PLUGIN_API_BASE_URL: 'https://test.api',
    });

    getAuthenticatedHttpClient.mockReturnValue(mockHttpClient);
  });

  test('should call POST with correct URL and payload in updateUserData', async () => {
    const mockPayload = { email: 'test@example.com' };
    mockHttpClient.post.mockResolvedValue({ status: 200 });

    const response = await updateUserData(mockPayload);

    expect(mockHttpClient.post).toHaveBeenCalledWith('https://test.api/cdd/', mockPayload);
    expect(response).toEqual({ status: 200 });
  });

  test('should call GET with correct URL in getExams', async () => {
    const mockData = { data: [{ id: 1, name: 'Mock Exam' }] };
    mockHttpClient.get.mockResolvedValue(mockData);

    const response = await getExams();

    expect(mockHttpClient.get).toHaveBeenCalledWith('https://test.api/exams/', { params: {} });
    expect(response).toEqual(mockData);
  });
});
