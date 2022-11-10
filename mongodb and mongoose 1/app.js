
const mongoose =require("mongoose");
mongoose.connect("mongodb://localhost:27017/fruitsdb");
const fruitSchema = new mongoose.Schema({
    name: String ,
    rating :Number ,
    review :String
});
const Fruits =mongoose.model("Fruits",fruitSchema);
const fruit =new Fruits ({
    name:"apple",
    rating: 6,
    review : "pretty solid"
});
//fruit.save(); ---> when once executed then do not use further.


//Now we are creating a new collection.
 const personschema =new mongoose.Schema(
     {
         name:String,
         age:Number
     }
 );

 const Person =mongoose.model("Person",personschema);
 const per=new Person({
     name:"john",
     age:37
 });
 //Note here person will by default get converted to people because people is plural.
// per.save();  ---> when once executed then do not use further.

const orange=new Fruits ({
name :"orange",
rating : 6,
review :"bit sour"
});
const mango=new Fruits ({
    name :"mango",
    rating : 9,
    review :"nice one"
    });
    //Now we are together inserting orange and fruit into the Fruits collection.
 /*   Fruits.insertMany([orange,mango],function(err)
    {
        //see in documentation on mongoose site.
        if(err)
        console.log(err);
        else
        console.log("added all items");
    });
    */ //as once we have added orange and mango hence we will comment out sothat it does not get added more than once.


    //To print name of all documents.
Fruits.find(function(err,fruit)
{
    if(err)
    console.log(err);
    else
    fruit.forEach(function(element)
    {
        console.log(element.name);
    })
   // mongoose.connection.close();
});

//Updation in database using mongoose

 /*
 Fruits.updateOne({id:"624001a3144f0eb3c6330c07"},{name:"pandeyfavourits"},function(err)

{
    if(err)
    console.log(err);
    else
    console.log("updated successfully");
}
)
*/

//to delete a document from a collection

/*Fruits.deleteOne({id:"623b5967a9945761a9d51273"},function(err)
{
    if(err)
    console.log(err);
    else
    console.log("deleted successfully");
});
*/
Person.deleteMany({name:"john"},function(err)
{
    if(err)
    console.log(err);
    else
    console.log("deleted successsfully");
});