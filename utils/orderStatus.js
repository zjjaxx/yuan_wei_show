export default function(status){
    switch(status){
        case 0:
            return "待付款"
        case 1:
            return "待发货"
        case 2:
            return "待收货"
        case 3:
            return "已收货"
        case 4:
            return "待评价"
    }
}