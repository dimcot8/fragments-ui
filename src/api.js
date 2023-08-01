// src/api.js

// fragments microservice API, defaults to localhost:8080
const apiUrl = process.env.API_URL || 'http://ec2-user@ec2-184-72-71-226.compute-1.amazonaws.com:8080';

/**
 * Given an authenticated user, request all fragments for this user from the
 * fragments microservice (currently only running locally). We expect a user
 * to have an `idToken` attached, so we can send that along with the request.
 */
export async function getUserFragments(user, expand) {
  console.log('Requesting user fragments data...');
  try {
    let url = `${apiUrl}/v1/fragments`;
    if (expand) url += '?expand=1';

    const res = await fetch(url, {
      // Generate headers with the proper Authorization bearer token to pass
      headers: user.authorizationHeaders(),
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    console.log('Got user fragments data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragments', { err });
  }
}


export async function getFragment(user, id, ext, info) {
  console.log('Requesting a single fragment...');

  let data;
  try {
    let url = `${apiUrl}/v1/fragments/${id}${ext}`;
    if (info) url += '/info';
    const res = await fetch(url, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    if (info) data = await res.json();
    else data = await res.text();
    console.log('Got user fragment data', { data });
  } catch (err) {
    console.error('Unable to call GET /v1/fragments/:id', { err });
  }
}


export async function getFragmentInfo(user, id) {
  console.log('Requesting fragments\' info...');
  try {
   
    const res = await fetch(`${apiUrl}/v1/fragments/${id}/info`, {
      headers: user.authorizationHeaders(),
      
    }); 


    if (res.status === 404) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    const contentType = res.headers.get('Content-Type');
    let data;

    if (contentType.includes('application/json')) {
      data = await res.json();
    } else if (contentType.includes('text/html') || contentType.includes('text/markdown')
     || contentType.includes('text/plain')) {
      data = await res.text();
    } else {
      data = await res.text();
    }
    console.log('Got user fragment\' info!', {data});
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}








export async function getFragmentData(user, id, ext) {
  console.log('Requesting fragments\' data...');
  let data;

  const container = document.querySelector('#data');
  container.textContent = '';

  try {
    const res = await fetch(`${apiUrl}/v1/fragments/${id}${ext}`, {
      headers: user.authorizationHeaders(),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    const contentType = res.headers.get('Content-Type');

    if (contentType === 'application/json') {

      data = await res.json();
      container.textContent = JSON.stringify(data);
    } else if (contentType.includes('markdown')) {
      data = await res.text();
      container.textContent = data;
    } else if (contentType.includes('html')) {
      data = await res.text();

      container.insertAdjacentHTML('beforeend', data);

    } else {
      data = await res.text();

      container.textContent = data;
    }

    console.log('Got user fragment data', { data });
  } catch (err) {
    console.error(`Unable to call GET /v1/fragments/${id}`, { err });
  }
}









export async function postFragment(user, fragment, type) {
  console.log('Posting user fragment data...');

  try {
    const res = await fetch(`${apiUrl}/v1/fragments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.idToken}`,
        'Content-Type': type,
      },
      body: fragment,
    });
    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }
    console.log('User fragment data posted', { fragment });
  } catch (err) {
    console.error('Unable to call POST /v1/fragment', { err });
  }
}
