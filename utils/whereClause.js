//{qty : { $gt : 20}}
// base = product.find()

//bigQ = search=coder&page=2&category=shortssleeves&ratings[gte]=4&price[lte]=999&price[gte]=199 
// for search
class whereClause {
    constructor(base, bigQ){
        this.base = base;
        this.bigQ = bigQ;
    }

    search(){
        const searchword = this.bigQ.search ? {
            name : {
                $regex : this.bigQ.search,
                $options : 'i'
            }
        } : {} ;
        this.base = this.base.find({...searchword});
        return this
    }


    pager(resultperpage){
        let currentPage = 1 ;
        if(this.bigQ.page){
            currentPage = this.bigQ.page;
        }

        const skipVal = resultperpage * (currentPage - 1)

       this.base =  this.base.limit(resultperpage).skip(skipVal);

       return this.base;
    }


    filter(){
        const copyQ = {...this.bigQ};
        delete copyQ[search];
        delete copyQ[page];
        delete copyQ[spage];

        //convert bigQ into a string => copyQ
        let stringOfCopyQ = JSON.stringify(copyQ);
        stringOfCopyQ = stringOfCopyQ.replace(/\b(gte|lte|gt|lt)\b/g, m => `$${m}`);
        jsonOfCopyQ = JSON.parse(stringOfCopyQ);
        
        this.base = this.base.find(jsonOfCopyQ); 

    }

}


module.exports = whereClause;


