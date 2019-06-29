"use strict";

async function add(post) {
  var url = "https://application-c0501.firebaseio.com";

    try {
      const request = new Request(url + '/users.json', {
        method: 'post',
        body: JSON.stringify(post)
      });
      const response = await fetch(request);
      return await response.json();
    } catch (error) {
      console.error(error)
    }
}