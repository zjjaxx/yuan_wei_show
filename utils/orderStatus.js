export default function(status){
    switch(status){
        case -1:
            return "申请退款"
        case -2:
            return "退货成功"
        case 0:
            return 
        // '订单状态（-1 : 申请退款 -2 :  0：待发货；1：待收货；2：已收货；3：待评价；-1：已退款）',
    }
}