async function generateEmbeddings(text){

    const response= await fetch(
    "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2",
    {
    
        method:"POST",
        headers:{
            Authorization:`Bearer ${process.env.HF_TOKEN}`,
            "Content-Type":"application/json"
        },
        body: JSON.stringify({inputs:text})//minilmv2 model accepts in texts or string foemat
                                //inputs is what HUgging face api expects
    }
)

if(!response.ok){
    throw new Error(`embedding failed : ${response.status} ${response.statusText}`)
}

const vector=await response.json()//response arrives as raw text. response.json() parses it into a JavaScript array of numbers.
   
return vector;
}

//loops through each chunk and embeds each one
async function embedChunks(chunks){

    const embeddedChunks=[];

    for(const chunk of chunks){
        //send chunk text to get its vector
        const vector=await generateEmbeddings(chunk.text);

        //add this vector to chunk object
        embeddedChunks.push({
            text:chunk.text,
            source:chunk.source,
            chunkIndex:chunk.chunkIndex,
            vector:vector
            // everything same as before
            // just vector added on top
        })
    }

    return embeddedChunks;// same array as input but each chunk now has vector
}

module.exports={generateEmbeddings,embeddedChunks};