import axios from 'axios';
import {apiKey, baseUrl, proxy} from "../config";

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const searchUrl = `${proxy}${baseUrl}/search?apiKey=${apiKey}&query=${this.query}&number=30`;
            const result = await axios.get(searchUrl);
            this.result = result.data.results;
        } catch (error) {
            alert(error);
        }
    }
}
