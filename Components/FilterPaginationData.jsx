import axios from "axios";

export const FilterPaginationData = async ({ create_new_arr = false, state, data1, page, countRoute, data_to_send, user = undefined }) => {
    let obj;

    let headers = {}

    if (user) {
        headers.headers = {
            'Authorization': `Bearer ${user}`
        }
    }

    if (state != null && !create_new_arr) {
        obj = { ...state, results: [...state.results, ...data1], page }
    } else {
        await axios.post(process.env.NEXT_PUBLIC_URL + countRoute, data_to_send, headers)
            .then(({ data }) => {
                let totalDocs = data.data.totalDocs;

                obj = { results: data1, page: 1, totalDocs }
            })
            .catch(err => [
                console.log(err)
            ])
    }

    return obj;
}