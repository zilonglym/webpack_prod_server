--酒店信息
create table `hotel_info` (
	`address` varchar(64) null comment '酒店地址',
	`check_in_time` varchar(64) null comment '当天入住时间',
	`check_out_time` varchar(64) null comment '退房时间',
	`comment_count` int not null comment '评论数',
	`decorate_date` varchar(64) null comment '装修时间',
	`fax` varchar(64) null comment '座机',
	`feature` varchar(1000) null comment '酒店特色',
	`group_id` int not null comment '分组ID',
	`hotel_id` varchar(64) null comment '酒店ID',
	`hotel_name` varchar(64) null comment '酒店名称',
	`hotel_number` int null comment '酒店数量',
	`img_url_list` varchar(512) comment '小图',
	`latitude` decimal(8,2) comment '维度',
	`longitude` decimal(8,2) comment '经度',
	`open_date` varchar(64) null comment '开业时间',
	`room_total` int null comment '房间总数',
	`rule` varchar(1000) null comment '特殊规则',
	`telephone_no` varchar(64) null comment '手机',
	`vote` decimal(8,1) null comment '评分',
	`website` varchar(512) comment '网址',
	primary key (`hotelId`)
	);
--酒店提供服务信息
create table `service_list` (
	`code` int not null comment '服务类型',
	`is_check` tinyint(1) not null comment 'isCheck',
	`is_flag` tinyint(1) not null comment 'isFlag',
	`name` varchar(64) null comment '服务名称',	
	primary key (`code`)
);
--酒店出售房型详情
create table `room_type_sale` (
	`hotel_id` varchar(64) not null comment '酒店ID',
	`house_type` varchar(64) null comment '房型',
	`room_type_id` varchar(64) null comment '房型id',
	`room_type_name` varchar(64) null comment '房型名称',
	`price` decimal(8,2) comment '价格',
	`room_area` varchar(64) null comment '房间大小',
	`img_url_list` varchar(1000) null comment '房型图片list',
	`is_direct_reserve_room` tinyint(1) not null comment 'isDirectReserveRoom',
	`landscaped` varchar(64) null comment 'landscaped',
	`address` varchar(64) null comment '房型地址',
	`bed_type` varchar(64) null comment '床型',
	`count` int null comment '房间总数',
	`day_price` int null comment '房间价格',
	`detail` varchar(64) null comment '房型详情',
	`floor` int null comment '房间楼层',
	`wifi_support` tinyint(1) not null comment 'wifiSupport',
	primary key (`hotel_id`, `room_type_id`)
);

			
--房型房号
create table `room_no` (
	`room_type_id` varchar(64) null comment '房型id',
	`room_no` varchar(64) null comment '房号'
	primary key (`room_type_id`, `room_no`)
);
	
--房型每日价格表
create table `day_price` (
	`hotel_id` varchar(64) not null comment '酒店ID',
	`house_type` varchar(64) null comment '房型',
	`day` timestamp not null default current_timestamp comment '日期',
	`price` decimal(8,2) comment '价格',
	primary key (`hotel_id`, `house_type`,`day`)
	);
			
			
--账户信息
create table `buyer_info` (
	`area_id` varchar(64) null comment '酒店ID',
	`area_name` varchar(64) null comment '酒店ID',
	`audit_status` varchar(64) null comment '酒店ID',
	`head_img_url` varchar(64) null comment '酒店ID',
	`id_number` varchar(64) null comment '酒店ID',
	`mobile` varchar(64) null comment '酒店ID',
	`nick_name` varchar(64) null comment '酒店ID',
	`open_id` varchar(64) null comment '酒店ID',
	`sex` varchar(64) null comment '酒店ID',
	`uid` varchar(64) null comment '酒店ID',
	`user_account` varchar(64) null comment '酒店ID',
	`user_id` varchar(64) null comment '酒店ID',
	`user_name` varchar(64) null comment '酒店ID',
	`wx_user_id` varchar(64) null comment '酒店ID',
	primary key (`user_id`)
	);
		
--订单
create table `order_master` (
	`hotel_id` varchar(64) not null comment '酒店ID',
	`order_id` varchar(64) not null comment '订单ID',
	`order_no` varchar(64) not null comment '订单No',
	`order_amount` decimal(8,2) comment 'orderAmount',
	`order_pay_amount` decimal(8,2) comment 'orderPayAmount',
	`order_status` tinyint(3) not null default '0' comment '订单状态',
	`can_pay_status` tinyint(1) not null comment 'canPayStatus',
	`user_coupon_id` decimal(8,2) comment 'userCouponId',
	`roomTotalCount` int null comment '房间楼层',
	`can_comment` tinyint(1) not null comment 'canComment',
	`checkin_date` timestamp not null default current_timestamp comment 'checkinDate',
	`checkout_date` timestamp not null default current_timestamp comment 'checkoutDate',
	`create_time` timestamp not null default current_timestamp comment '创建时间',
	`discount_amount` decimal(8,2) comment 'discountAmount',
	`hotel_name` varchar(64) null comment '酒店名称',
	primary key (`order_id`)
	);
	
--订单详情
create table `order_detail` (
	`detail_id` varchar(32) not null,
	`order_id` varchar(64) not null comment '订单ID',
	`room_no` varchar(64) null comment '房号',
	`room_type_name` varchar(64) null comment '房型名称',
	`total_price` decimal(8,2) comment 'totalPrice',
	primary key (`detail_id`),
    key `idx_order_id` (`order_id`)
);

