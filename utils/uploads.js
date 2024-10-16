const multer = require("multer");


const file_type ={
    "image/png":"png",
    "image/jpeg":"jpeg",
    "image/jpg":"jpg",
    'image/svg+xml':'svg',
}

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const valid_format = file_type[file.mimetype];
       let error = new Error("Invalid file type");
       error.status = 400;
       if(valid_format){
        error =null;
       }
       
       cb(error,"public/uploads"); 
    },
    filename:function(req,file,cb){

        const file_extension = file_type[file.mimetype];    
        const unique_suffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        
        cb(null,`${file.fieldname}-${unique_suffix}.${file_extension}`);
    }
});

exports.upload = multer({storage:storage});
