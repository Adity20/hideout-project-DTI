import { useEffect, useState } from "react";

const FileUpload = () => {
    const[file, setFile] = useState(null);
    const[filename, setFilename] = useState('Choose File');

    useEffect(()=>{
        if(file){
            setFilename(file.name);
        }
    }
    ,[file]);
    return (
        <div>
            <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
            <div>
                {filename}
            </div>
        </div>
    )
}