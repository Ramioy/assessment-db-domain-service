import { HttpException, HttpStatus, ArgumentsHost } from '@nestjs/common';
import { HttpErrorFilter } from '@shared/filters/http-exception.filter';

function makeArgumentsHost(replyMock: { status: jest.Mock; send: jest.Mock }): ArgumentsHost {
  return {
    switchToHttp: () => ({
      getResponse: () => replyMock,
      getRequest: () => ({}),
      getNext: () => jest.fn(),
    }),
    getArgs: () => [],
    getArgByIndex: () => undefined,
    switchToRpc: jest.fn(),
    switchToWs: jest.fn(),
    getType: () => 'http',
  } as unknown as ArgumentsHost;
}

describe('HttpErrorFilter', () => {
  let filter: HttpErrorFilter;
  let reply: { status: jest.Mock; send: jest.Mock };
  let host: ArgumentsHost;

  beforeEach(() => {
    filter = new HttpErrorFilter();
    reply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    host = makeArgumentsHost(reply);
  });

  it('handles HttpException with correct status and string message', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    filter.catch(exception, host);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404, message: 'Not Found' }),
    );
  });

  it('handles HttpException with object response body', () => {
    const exception = new HttpException(
      { message: 'Bad input', errors: [] },
      HttpStatus.BAD_REQUEST,
    );
    filter.catch(exception, host);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    const sent = reply.send.mock.calls[0][0] as Record<string, unknown>;
    expect(sent.statusCode).toBe(400);
  });

  it('handles unknown non-HttpException with 500 status', () => {
    filter.catch(new Error('Unexpected'), host);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(reply.send).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500, message: 'Unexpected' }),
    );
  });

  it('includes timestamp in the response', () => {
    filter.catch(new Error('err'), host);

    const sent = reply.send.mock.calls[0][0] as Record<string, unknown>;
    expect(typeof sent.timestamp).toBe('string');
    expect(() => new Date(sent.timestamp as string)).not.toThrow();
  });

  it('handles non-Error primitives gracefully', () => {
    filter.catch('some string error', host);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('handles null exception gracefully', () => {
    filter.catch(null, host);

    expect(reply.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
