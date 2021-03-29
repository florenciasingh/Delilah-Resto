const pool = require('../db/database');
const moment= require('moment');
const errors=require('../exception');

const updOrder = 'UPDATE ORDERS SET ? WHERE orderid= ? and STATUSINFO not in(5,6)';
const queryGetAllOrders = `SELECT os.name status,DATE_FORMAT(o.orderdate,'%h:%i %p') hora,concat('#',o.orderid) orderid,od.description,o.amount, us.fullname,us.address 
FROM orders o, orderstatus os, users us,(select orderid, GROUP_CONCAT(od.quantity,'#',p.name) description
                                         from orderdetails od, products p 
										 where od.productid=p.productid 
										 group by orderid) od
where o.statusinfo=os.id 
and o.clientinfo=us.username
and o.orderid=od.orderid
`;

const delOrder=`UPDATE ORDERS SET STATUSINFO=5 WHERE orderid=? and STATUSINFO not in(5,6)`;

const getDateTime = () => {
    const fecha = new Date;
    return moment(fecha).format("YYYY-MM-DD HH:mm:ss");
}
const createOrder = async (orders,username) => {
    try {
        const newOrder = {
            orderdate: getDateTime(),
            clientinfo: username, /* orders.clientinfo, */
            amount: orders.amount,
            payment: orders.payment,
            statusinfo: orders.statusinfo
        };
        await pool.poolConnection.query("START TRANSACTION");
        const res = await pool.poolConnection.query("INSERT INTO ORDERS SET ?", [newOrder]);
        const orderId = res.insertId;
        let newOrderDetails = [];
        orders.orderdetails.forEach(element => {
            let orderDetails = [
                orderId,
                element.productid,
                element.quantity,
                element.unitprice
            ];
            newOrderDetails.push(orderDetails);
        });

        await pool.poolConnection.query("INSERT INTO ORDERDETAILS values ?", [newOrderDetails]);

        await pool.poolConnection.query("COMMIT");

        return orderId;
    } catch (error) {
        console.log(error);
        await pool.poolConnection.query("ROLLBACK");
        throw error;
    }
};


const updateOrder = async (data, orderid) => {
    try {

        const result = await pool.poolConnection.query(updOrder, [data, orderid]);
        if (result.affectedRows===0) {
            return errors(404,'UPD','No se modificó el pedido','');
        }

        return errors(200,'UPD',`Se modificó el estado del pedido número: ${orderid} `,'');;
    } catch (error) {
        console.log(error);

        throw error;
    }
};

const convertStringToArray=(text, separator)=>{
return text.split(separator);
};
const splitDescriptionProduct=(text, pos)=>{
return text.substring(text.indexOf("#")+1,pos);
};
const concatDescriptionProduct=(arrString)=>{
    let descProd='';
    const result=arrString.forEach(element => {
        descProd=descProd+element.substring(0,4);
    });
return descProd
};

const getOrders=(orders)=>{
    let ordersAll=[];
    orders.forEach(e=> {
        const arrLevel1=convertStringToArray(e.description,',');
        let description='';
        arrLevel1.forEach(el=> {
            const descProd=splitDescriptionProduct(el,el.length);
            const quantityProd=splitDescriptionProduct(el,0).replace('#','x');
            const arrDescProd=convertStringToArray(descProd,' ');
            description=description+' '+quantityProd+concatDescriptionProduct(arrDescProd);
            
        });
        const arrOrder={
            status: e.status,
            hora: e.hora,
            orderid: e.orderid,
            description: description.trim(),
            amount: e.amount,
            fullname: e.fullname,
            address: e.address
        };
        ordersAll.push(arrOrder);
    });
    return ordersAll;
};


const getAllOrdersByUser = async (username) => {
    try {
        const queryByUser=queryGetAllOrders.concat('and o.clientinfo=?');
        const result = await pool.poolConnection.query(queryByUser,username);
        const orders= JSON.parse(JSON.stringify(result));
        return getOrders(orders);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const getAllOrders = async () => {
    try {
        const result = await pool.poolConnection.query(queryGetAllOrders);
        const orders= JSON.parse(JSON.stringify(result));
        return getOrders(orders);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const deleteOrder= async(orderid)=>{
    try {
        const result= await pool.poolConnection.query(delOrder, orderid);
        if (result.affectedRows===0) return errors(404,'DEL','No se eliminó el pedido','');
        return errors(200,'DEL','Se eliminó el pedido correctamente','');
    } catch (error) {
        console.log(error);
        return errorsDB(error);
    }
};
module.exports = {
    createOrder,
    updateOrder,
    getAllOrders,
    getAllOrdersByUser,
    deleteOrder

};