import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Image from "@editorjs/image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { uploadImage } from "@/middleware/aws";


const uploadImageUrl = async (e) => {
    let link = new Promise((resolve, reject) => {
        try {
            resolve(e);
        } catch (err) {
            reject(err)
        }
    })

    return link.then((url) => {
        return {
            success: true,
            file: { url }
        }
    })
}



const uploadImageFile = (e) => {
    return uploadImage(e).then(url => {
        if (url) {
            return {
                success: true,
                file: { url }
            };
        }
    })
}

export const tools = {
    embed: Embed,
    header: {
        class: Header,
        config: {
            placeholder: "Heading",
            levels: [2, 3],
            defaultLevel: 2
        },
    },
    list: {
        class: List,
        inlineToolbar: true,
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageUrl,
                uploadByFile: uploadImageFile
            }
        }
    },
    marker: Marker,
    inlineCode: InlineCode
}