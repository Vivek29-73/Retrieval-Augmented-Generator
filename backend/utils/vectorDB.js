const {qdrantClient, QdrantClient}=require("@qdrant/js-client-rest");

//connect to quadrant running locally via docker

const qdrant =new QdrantClient({
    host:"localhost",//qdrant running on your machine ,port 6333 qdarant default port
    post:6333
});

