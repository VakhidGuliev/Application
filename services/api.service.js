"use strict";

async function add(post,addres) {
  var url = "https://application-c0501.firebaseio.com";

    try {
      const request = new Request(url + addres, {
        method: 'post',
        body: JSON.stringify(post)
      });
      const response = await fetch(request);
      return await response.json();
    } catch (error) {
      console.error(error)
    }
}

async function get(address) {
  var url = "https://application-c0501.firebaseio.com";

  try {
    const request = new Request(url + address, {
      method: 'get'
    });
    const response = await fetch(request);
    return await response.json();
  } catch (error) {
    console.error(error)
  }
}