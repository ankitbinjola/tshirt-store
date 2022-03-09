//{qty : { $gt : 20}}
// base = product.find()

//bigQ = search=coder&page=2&category=shortssleeves&ratings[gte]=4&price[lte]=999&price[gte]=199 
// for search
class WhereClause {  
 
 
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
        
        return this ;
    
    
    }





    pager(resultperpage){
        let currentPage = 1 ;
        // console.log(resultperpage)
        if(this.bigQ.page){
            currentPage = this.bigQ.page;
        }

        // console.log('this.base', this.base.limit(1));

        const skipVal = resultperpage * (currentPage - 1)

       this.base =  this.base.limit(resultperpage).skip(skipVal);

       return this.base;
    }


    filter() {
        // create copy of bigquery
        const copyQuery = {...this.bigQuery}
 
        // remove other filters
        delete copyQuery["search"]
        delete copyQuery["limit"]
        delete copyQuery["page"]
 
        let serializedQuery = JSON.stringify(copyQuery)
 
        // change 'filter' to '$filter'
        serializedQuery = serializedQuery.replace(
            /\b(gte|lte)\b/g,
            ///\b(gt|lt)\b/g,
            (match) => `$${match}`
        )
 
        const deserializedQuery = JSON.parse(serializedQuery)
 
        this.base = this.base.find(deserializedQuery)

        return this;
    }
 

}


module.exports = WhereClause;


