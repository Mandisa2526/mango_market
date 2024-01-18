export default function Query(db){
    
    async function insertShops(shopName) {
        await db.none(`INSERT INTO shop(name) VALUES (1, '${shopName}')`);
    }

    return{
      insertShops
    }
}