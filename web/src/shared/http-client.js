/**
 * @file HTTP client utility
 */

/**
 * Query object for URL building
 */
// export interface QueryArgs {
//     [key: string]: string | number | null | undefined;
// }

/**
 * Builds a URL with encoded query args from the given object.
 *
 * @param endpoint
 * @param params
 * @return Parameterized and encoded URL
 */
// export function buildURL(endpoint: string, params: QueryArgs) {
export function buildURL(endpoint, params) {
    return `${endpoint.startsWith('/') ? 'api' : ''}${endpoint}${
        params
            ? `?${Object.entries(params)
                  .filter(([k, v]) => v !== null && 'undefined' !== typeof v)
                  .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                  .join('&')}`
            : ''
    }`;
}

/**
 * Sends a GET request to the given endpoint
 *
 * @param endpoint Endpoint to send to
 * @param options Request options
 */
// export async function GET(endpoint: string, options?: RequestOptions): Promise<ApiResponse> {
export async function GET(endpoint, options) {
    return await request(
        {
            method: 'GET',
            endpoint,
        },
        options,
    );
}

/**
 * Sends a POST request to the given endpoint
 *
 * @param endpoint Endpoint to send to
 * @param body Any JSON serializable body
 * @param options Request options
 */
// export async function POST(endpoint: string, body: any, options?: RequestOptions): Promise<ApiResponse> {
export async function POST(endpoint, body, options) {
    return await request(
        {
            method: 'POST',
            endpoint,
            body: JSON.stringify(body),
        },
        options,
    );
}

/**
 * Sends a PUT request to the given endpoint
 *
 * @param endpoint Endpoint to send to
 * @param body Any JSON serializable body
 * @param options Request options
 */
// export async function PUT(endpoint: string, body: any, options?: RequestOptions): Promise<ApiResponse> {
export async function PUT(endpoint, body, options) {
    return await request(
        {
            method: 'PUT',
            endpoint,
            body: JSON.stringify(body),
        },
        options,
    );
}

/**
 * Sends a DELETE request to the given endpoint
 *
 * @param endpoint Endpoint to send to
 * @param options Request options
 */
// export async function DELETE(endpoint: string, options?: RequestOptions): Promise<ApiResponse> {
export async function DELETE(endpoint, options) {
    return await request(
        {
            method: 'DELETE',
            endpoint,
        },
        options,
    );
}

/**
 * Performs a multipart/form-data file upload
 *
 * @param endpoint Endpoint to upload to
 * @param body FormData object with Files
 */
//export async function UPLOAD(endpoint: string, body: FormData, options?: RequestOptions): Promise<ApiResponse> {
export async function UPLOAD(endpoint, body, options) {
    return await request(
        {
            method: 'POST',
            endpoint,
            body,
        },
        Object.assign({}, options || {}, { omitContentType: true }),
    );
}

/**
 * A response returned from the HTTP API
 */
// export interface ApiResponse {
//     /**
//      * Response headers
//      */
//     readonly headers: Headers;
//
//     /**
//      * Whether the response was ok (status code from 200 to 299)
//      */
//     readonly ok: boolean;
//
//     /**
//      * Status response text
//      */
//     readonly statusText: string;
//
//     /**
//      * Response status code
//      */
//     readonly status: number;
//
//     /**
//      * The URL from the response object
//      */
//     readonly url: string;
//
//     /**
//      * The returned body
//      */
//     readonly body: any;
// }

/**
 * HTTP verbs supported by `request()`
 */
// export enum SupportedHttpVerbs {
//     GET = 'GET',
//     PUT = 'PUT',
//     POST = 'POST',
//     DELETE = 'DELETE',
// }

/**
 * A request object to be sent to the HTTP API
 */
// export interface ApiRequest {
//     /**
//      * Endpoint to send to
//      */
//     readonly endpoint: string;
//
//     /**
//      * HTTP Verb
//      */
//     readonly method: SupportedHttpVerbs;
//
//     /**
//      * The body to send
//      * Will be ignored if `method` is `GET` or `DELETE`
//      */
//     readonly body?: string | FormData;
// }

/**
 * Options when sending a request to the HTTP API
 */
// export interface RequestOptions {
//     /**
//      * If `true`, will not set the content-type header at all
//      * That is necessary when the user's browser shall determine that, e.g.
//      * when uploading a file.
//      */
//     omitContentType?: boolean;
//
//     /**
//      * If `true`, will redirect the user to the login and explicitely destroy
//      * their session when receiving a 401 AUTHENTICATION REQUIRED response.
//      */
//     terminateSessionOn401?: boolean;
// }

/**
 * Default options for `request`
 */
// const DEFAULT_OPTIONS: RequestOptions = {
const DEFAULT_OPTIONS = {
    omitContentType: false,
    terminateSessionOn401: true,
};

/**
 * Sends a request to the HTTP API
 *
 * @param req Request object to send
 * @param options Request options, see {@link RequestOptions}
 */
// export async function request(req: ApiRequest, options: RequestOptions = DEFAULT_OPTIONS): Promise<ApiResponse | null> {
export async function request(req, options = DEFAULT_OPTIONS) {
    const payload = {
        method: req.method,
        headers: {
            'b-api': 'auth1234', // TODO: Remove
        },
        credentials: 'include',
    };
    if ('GET' !== req.method && 'DELETE' !== req.method) {
        payload.body = req.body;
    }

    if (!options.omitContentType) {
        payload.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`/api/${req.endpoint}`, payload);

    let body = null;

    // We try to parse the body first, thereby also providing it to the 401
    // handling
    try {
        body = await response.json();
    } catch (err) {
        if (err instanceof SyntaxError) {
            if (__DEV__) {
                console.error('Response is not valid JSON');
            }
        } else {
            if (__DEV__) {
                console.error('Unknown error while parsing JSON');
            }
        }

        return Promise.reject(null);
    }

    const apiResponse = {
        headers: response.headers,
        ok: response.ok,
        statusText: response.statusText,
        status: response.status,
        url: response.url,
        body,
    };

    logInteraction(req, apiResponse);

    // If the API is not available, set the availability status
    // and return
    if (502 === apiResponse.status || 504 === apiResponse.status) {
        if (__DEV__) {
            console.error('Application unreachable, status code = %d', apiResponse.status);
        }

        return Promise.reject(apiResponse);
    }

    // If we get back a 401, the session of the user might have expired
    // or does not exist at all
    if (401 === apiResponse.status) {
        if (options.terminateSessionOn401) {
            location.reload();
        }

        return Promise.reject(apiResponse);
    }

    // If the response is not okay for another reason, display a reasonable error
    // message to the user
    if (!apiResponse.ok) {
        let description = null;

        if (null !== apiResponse.body && apiResponse.body.error) {
            description = apiResponse.body.error;
        }

        if (__DEV__) {
            console.error('Request errored, reason:', description || '(Unknown)');
        }

        return Promise.reject(apiResponse);
    }

    return Promise.resolve(apiResponse);
}

// The following things will be removed by webpack tree-shaking

/**
 * Logs information about the given request and response to the console
 * Does not log in non-dev.
 *
 * @param request Request sent
 * @param response Response received
 */
// function logInteraction(request: ApiRequest, response: ApiResponse): void {
function logInteraction(request, response) {
    if (__DEV__) {
        console.log(
            `%c${new Date().toISOString()} HTTP %c${request.method} %s %c${response.status} ${response.statusText}`,
            'color: gray;',
            'background: none; color #000; padding: 1px 5px',
            request.endpoint,
            !response.ok
                ? 'color: #fff;padding: 1px 4px;border-radius: 2px;background-color: red;'
                : 'color: #fff;padding: 1px 4px;border-radius: 2px;background-color: green;',
            response.body,
        );
    }
}
