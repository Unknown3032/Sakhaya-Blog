import axios from "axios"


export const uploadImage = async (img) => {
    let imageUrl = null
    await axios.get(process.env.NEXT_PUBLIC_URL + "/api/uploadImage").then(async ({ data: { url } }) => {
        await axios({
            method: 'PUT',
            url,
            headers: { 'Content-Type': "multipart/form-data" },
            data: img
        }).then(() => {
            imageUrl = url.split('?')[0]
        })
    })

    return imageUrl
}