export default function MangoShopper(db) {
	

	async function createShop(shopName) {
		//insert shop name
		const result = await db.one(`INSERT INTO shop(name) VALUES ('${shopName}') RETURNING id`);
		//return the id
		return result.id;
	}

	async function listShops() {
		//select everything from the shop table
		let shops = await db.manyOrNone('SELECT * FROM shop;');
		return shops;
	}

	async function dealsForShop(shopId) {
	//use inner join to join the fields
		let mango_deals = await db.manyOrNone(`SELECT shop.name as shop_name, qty, price FROM  mango_deal  inner join shop on shop_id=shop.id where shop_id = ${shopId};`);
		return mango_deals;
	}

	async function topFiveDeals() {   
		//select top 5 deals by ordering quantiy in descending order
		//price by ascending order
		//Limit to 5  
		let topFiveDeal = await db.manyOrNone(`SELECT *FROM mango_deal ORDER BY qty DESC, price ASC LIMIT 5`)
		return topFiveDeal
	}

	async function createDeal(shopId, qty, price) {
		//put the values to the mango deal table
		const result = await db.one(`INSERT INTO  mango_deal(shop_id, qty, price) VALUES (${shopId}, ${qty}, ${price}) RETURNING id`);
		return result.id;
	}

	async function recommendDeals(amount) {
		//if amout is greater or = to deals available 
		//deals can be displayed
		let recommeded = await db.manyOrNone(`SELECT qty, price FROM mango_deal WHERE price <= ${amount};
		`)
		return recommeded
	}

	return {
		createDeal,
		createShop,
		listShops,
		dealsForShop,
		recommendDeals,
		topFiveDeals
	}


}