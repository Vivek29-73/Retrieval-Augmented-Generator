// src/api/index.js
// all backend API calls in one place
// makes it easy to change base URL later

const BASE_URL = "http://localhost:5000/api"

// AUTH API CALLS
export async function registerUser(name, email, password) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        // credentials include = send cookies with request
        // needed for auth to work
        body: JSON.stringify({ name, email, password })
    })
    return res.json()
}

export async function loginUser(email, password) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
    })
    return res.json()
}

export async function logoutUser() {
    const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
    return res.json()
}

export async function getMe() {
    const res = await fetch(`${BASE_URL}/auth/me`, {
        credentials: "include"
    })
    return res.json()
}

// DOCUMENT API CALLS
export async function uploadDocuments(files) {
    const formData = new FormData()
    // FormData is used to send files
    // same as form-data in Postman

    for(const file of files) {
        formData.append("documents", file)
        // "documents" must match multer field name in backend
    }

    const res = await fetch(`${BASE_URL}/documents/upload`, {
        method: "POST",
        credentials: "include",
        body: formData
        // no Content-Type header needed for FormData
        // browser sets it automatically with boundary
    })
    return res.json()
}

export async function getDocuments() {
    const res = await fetch(`${BASE_URL}/documents/my-documents`, {
        credentials: "include"
    })
    return res.json()
}

export async function deleteDocument(documentId) {
    const res = await fetch(`${BASE_URL}/documents/${documentId}`, {
        method: "DELETE",
        credentials: "include"
    })
    return res.json()
}

// ASK API CALLS
export async function askQuestion(question) {
    const res = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ question })
    })
    return res.json()
}

export async function getHistory() {
    const res = await fetch(`${BASE_URL}/ask/history`, {
        credentials: "include"
    })
    return res.json()
}