import axios from 'axios';
import { BASE_URL as baseURL } from '../utils';

export const network = axios.create({ baseURL });
export const routes = {
  onion: {
    stronghold: `stronghold`,
    deeppaste: `deeppaste`,
  },
};
