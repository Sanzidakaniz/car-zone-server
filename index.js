const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config();
const cors=require('cors');

const app=express();
const port=process.env.PORT ||5000;

//middleware 
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lo869.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send('bicycle server')
});

async function run(){
try{
    await client.connect();
    console.log('database connected');
    const database=client.db('bicycle-zone');
    const productsCollection=database.collection('products');  
    const reviewsCollection=database.collection('reviews');  
    const ordersCollection=database.collection('orders');  
    const usersCollection=database.collection('users');  
   
    
   
    //Products get api 
    app.get('/products',async(req,res)=>{
        const cursor=productsCollection.find({});
        const products=await cursor.toArray();
        res.send(products);
    });
     // products post api 
     app.post('/products',async(req,res)=>{
        const product= req.body;
            console.log('hit the api',product);
             const result=await productsCollection.insertOne(product); 
             console.log(result);
            res.json(result)
         });

         //delete product
      
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.json(result);
        });
          //get single product
    app.get('/products/:id',async(req,res)=>{
        const id=req.params.id;
        console.log('get single product',id);
        const query={ _id: ObjectId(id)};
        const product=await productsCollection.findOne(query);
        res.json(product);
    });


         //*****************************************//
    //reviews get api 
    app.get('/reviews',async(req,res)=>{
        const cursor=reviewsCollection.find({});
        const reviews=await cursor.toArray();
        res.send(reviews);
    });
     // reviews post api 
     app.post('/reviews',async(req,res)=>{
        const review= req.body;
            console.log('hit the api',review);
             const result=await reviewsCollection.insertOne(review); 
             console.log(result);
            res.json(result)
         });


         //*****************************************//
    
    // orders post api 
    app.post('/orders',async(req,res)=>{
        const order = req.body;
            console.log('hit the api',order);
             const result=await ordersCollection.insertOne(order); 
             console.log(result);
            res.json(result)
         });

           //Orders get api for manage all orders
    app.get('/allorders',async(req,res)=>{
        const cursor=ordersCollection.find({});
        const orders=await cursor.toArray();
        res.send(orders);
    });

   
    // //order delete 
    // app.delete('/orders/:id', async(req, res) => {
    //     const id  = req.params.id;
    //     console.log('hit the delete',id)
    //     const query ={_id:ObjectId(id)};
    //     const result = await ordersCollection.deleteOne(query);
    //     res.json(result);
    // });

    //Delete order
    app.delete('/orders/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const result = await ordersCollection.deleteOne(query);
        res.json(result);
    });


    app.get('/orders', async (req, res) => {
        const email = req.query.email;
        const query = { email: email };
        const cursor = ordersCollection.find(query);
        const orders = await cursor.toArray();
        res.json(orders);
    });

    // //orders get api 
    // app.get('/myorder', async (req, res) => {
    //     const email = req.query.email;
    //     const query = { email: email };
    //     const cursor = ordersCollection.find(query);
    //     const orders = await cursor.toArray();
    //     res.json(orders);
    // })

// ///users get api
// app.get('/users/:email', async (req, res) => {
//     const email = req.params.email;
//     const query = { email: email };
//     const user = await usersCollection.findOne(query);
//     let isAdmin = false;
//     if (user?.role === 'admin') {
//         isAdmin = true;
//     }
//     res.json({ admin: isAdmin });
// })

//     //users post api 
    
//       app.post('/users',async(req,res)=>{
//         const user= req.body;
//             console.log('hit the api',user);
//              const result=await usersCollection.insertOne(user); 
//              console.log(result);
//             res.json(result)
//          });
// //update part
//          app.put('/users/admin', async (req, res) => {
//             const user = req.body;
//             const filter = { email: user.email };
//             const updateDoc = { $set: { role: 'admin' } };
//             const result = await usersCollection.updateOne(filter, updateDoc);
//             res.json(result);
//         });
//          //admin put part

//         //  app.put('/users/admin',  async (req, res) => {
//         //     const user = req.body;
//         //     console.log(user);
//         //     if (requester) {
//         //         const requesterAccount = await usersCollection.findOne({ email: requester });
//         //         if (requesterAccount.role === 'admin') {
//         //             const filter = { email: user.email };
//         //             const updateDoc = { $set: { role: 'admin' } };
//         //             const result = await usersCollection.updateOne(filter, updateDoc);
//         //             res.json(result);
//         //         }
//         //     }
//         //     else {
//         //         res.status(403).json({ message: 'you do not have access to make admin' })
//         //     }

//         // })

    

//get admin user
app.get('/users/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === 'admin') {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
})

//POST Users
app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    // console.log(result);
    res.json(result);
});
//Update Users
app.put('/users', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const updateDoc = { $set: { role: 'admin' } };
    const result = await usersCollection.updateOne(filter, updateDoc);
    res.json(result);
});
    
}

finally{
    // await client.close();
}
}
run().catch(console.dir);




app.listen(port,()=>{
    console.log('listening on port',port);
});

//user:bicycle      password: FWahUW9kRhlFlaXm