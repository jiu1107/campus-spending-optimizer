-- MySQL dump 10.13  Distrib 9.6.0, for macos15.7 (arm64)
--
-- Host: localhost    Database: consumption_db
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'cb633864-5b81-11f1-b092-2dddcb6493b3:1-106';

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budgets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKln0tm5tgf3f9q3sp9sa5m8m7b` (`user_id`),
  CONSTRAINT `FKln0tm5tgf3f9q3sp9sa5m8m7b` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgets`
--

LOCK TABLES `budgets` WRITE;
/*!40000 ALTER TABLE `budgets` DISABLE KEYS */;
INSERT INTO `budgets` VALUES (1,15000,'문화',6,2026,1),(2,0,'식비',6,2026,1),(3,50000,'편의점',6,2026,1),(4,50000,'쇼핑',6,2026,1),(5,50000,'카페',6,2026,1);
/*!40000 ALTER TABLE `budgets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_benefits`
--

DROP TABLE IF EXISTS `card_benefits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card_benefits` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `benefit_type` enum('DISCOUNT','POINT') COLLATE utf8mb4_unicode_ci NOT NULL,
  `benefit_value` decimal(10,4) DEFAULT NULL,
  `category` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `requirement_min` int NOT NULL,
  `card_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhinxq0mv0toqtqsv2uiyjsfe2` (`card_id`),
  CONSTRAINT `FKhinxq0mv0toqtqsv2uiyjsfe2` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_benefits`
--

LOCK TABLES `card_benefits` WRITE;
/*!40000 ALTER TABLE `card_benefits` DISABLE KEYS */;
INSERT INTO `card_benefits` VALUES (1,'DISCOUNT',0.1000,'CAFE',200000,1),(2,'DISCOUNT',0.1500,'CULTURE',200000,1),(3,'DISCOUNT',0.0500,'SHOPPING',200000,1),(4,'POINT',0.0500,'CONVENIENCE_STORE',10000,2),(5,'POINT',0.0500,'CAFE',10000,2),(6,'POINT',0.0020,'FOOD',0,3),(7,'POINT',0.0030,'CAFE',0,3),(8,'POINT',0.0030,'CONVENIENCE_STORE',0,3),(9,'POINT',0.0030,'CULTURE',0,3),(10,'POINT',0.0030,'SHOPPING',0,3),(11,'DISCOUNT',0.0300,'CAFE',0,4),(12,'DISCOUNT',0.0200,'CONVENIENCE_STORE',0,4),(13,'POINT',0.0000,'FOOD',0,5),(14,'POINT',0.0000,'CAFE',0,5),(15,'POINT',0.0000,'CONVENIENCE_STORE',0,5),(16,'POINT',0.0000,'CULTURE',0,5),(17,'POINT',0.0000,'SHOPPING',0,5),(18,'POINT',0.0000,'FOOD',0,6),(19,'POINT',0.0000,'CAFE',0,6),(20,'POINT',0.0100,'CONVENIENCE_STORE',0,6),(21,'POINT',0.0000,'CULTURE',0,6),(22,'POINT',0.0100,'SHOPPING',0,6),(23,'DISCOUNT',0.0200,'FOOD',200000,7),(24,'DISCOUNT',0.0300,'CAFE',200000,7),(25,'DISCOUNT',0.0200,'CONVENIENCE_STORE',200000,7),(26,'DISCOUNT',0.0300,'SHOPPING',200000,7),(27,'DISCOUNT',0.0500,'CAFE',300000,8),(28,'DISCOUNT',0.1000,'CONVENIENCE_STORE',300000,8),(29,'DISCOUNT',0.1000,'CULTURE',300000,8);
/*!40000 ALTER TABLE `card_benefits` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cards`
--

DROP TABLE IF EXISTS `cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `base_benefit_rate` decimal(5,2) NOT NULL,
  `card_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_url` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cards`
--

LOCK TABLES `cards` WRITE;
/*!40000 ALTER TABLE `cards` DISABLE KEYS */;
INSERT INTO `cards` VALUES (1,0.01,'신한카드 춘식이 체크카드','신한','http://example.com/shinhan_choonsik.png'),(2,0.00,'하나1Q 체크카드','하나','http://example.com/hana_1q.png'),(3,0.00,'올바른POINT 체크카드','농협','http://example.com/nh_point.png'),(4,0.00,'프렌즈 체크카드','카카오뱅크','http://example.com/kakaobank_friends.png'),(5,0.01,'토스뱅크 체크카드','토스뱅크','http://example.com/tossbank_check.png'),(6,0.00,'카드의정석2 원더라이프 체크카드','우리','http://example.com/woori_wonderlife.png'),(7,0.01,'트래블러스 체크카드','KB국민','http://example.com/kb_travelers.png'),(8,0.01,'IBK 일상의 기쁨 체크카드','기업','http://example.com/ibk_joy.png');
/*!40000 ALTER TABLE `cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consumptions`
--

DROP TABLE IF EXISTS `consumptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consumptions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `category` enum('FOOD','CAFE','TRANSPORT','SHOPPING','ENTERTAINMENT','EDUCATION','HEALTH','CONVENIENCE_STORE','CULTURE','ETC') COLLATE utf8mb4_unicode_ci NOT NULL,
  `consumed_at` datetime(6) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `store_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `card_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK19gdr6hljy3p2pcdudlgm7qgd` (`user_id`),
  CONSTRAINT `FK19gdr6hljy3p2pcdudlgm7qgd` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consumptions`
--

LOCK TABLES `consumptions` WRITE;
/*!40000 ALTER TABLE `consumptions` DISABLE KEYS */;
INSERT INTO `consumptions` VALUES (3,333,'FOOD','2026-07-02 17:23:24.000000',NULL,NULL,'33',1,NULL);
/*!40000 ALTER TABLE `consumptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_cards`
--

DROP TABLE IF EXISTS `user_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_cards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `current_performance` int NOT NULL,
  `card_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKefwiamg1vpbkr9wh1jarqyeg4` (`user_id`,`card_id`),
  KEY `FK6c88junkes22vgqua5kyc543e` (`card_id`),
  CONSTRAINT `FK55ime3genywh3rg5yu62hmfvy` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK6c88junkes22vgqua5kyc543e` FOREIGN KEY (`card_id`) REFERENCES `cards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_cards`
--

LOCK TABLES `user_cards` WRITE;
/*!40000 ALTER TABLE `user_cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UK_2ty1xmrrgtn89xt7kyxx6ta7h` (`nickname`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-05-30 12:29:21.838133','test2@test.com','테스트','$2a$10$9UD6evvgZsT8SA8uyFHAjukpuNl1dxfiFdrncxJvRL5hLIRYE1NlK');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-02  1:21:24
