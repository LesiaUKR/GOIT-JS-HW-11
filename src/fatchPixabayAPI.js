import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '33612698-29a0e4fa17aff9da96c8a261f';

async function fatchPixabayAPI(searchQuery, page = 1, perPage) {
 
  const response = await axios.get(`${BASE_URL}?key=${KEY_API}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`);
    
  return response.data;
}

export { fatchPixabayAPI };