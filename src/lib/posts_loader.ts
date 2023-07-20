import { readFile } from "node:fs/promises"
import Thread from "../types/thread";

export async function loadPostDataFromFile(path: string): Promise<Thread[]> {
    const data = await loadJson(path)
    sanityCheck(data, path)
    return data as Thread[]
}

export async function loadJson(path: string): Promise<any> {
    var json = await readFile(path, 'utf8')
    return JSON.parse(json)
}

function sanityCheck(data: Promise<any>, path: string) {
    if (!Array.isArray(data)) {
        throw Error(`did not find valid post data (not an array) in ${path}`)
    }
    if (data.length == 0) {
        throw Error(`did not find valid post data (empty array) in ${path}`)
    }
}
