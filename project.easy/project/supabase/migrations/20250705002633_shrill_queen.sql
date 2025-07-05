-- =====================================================
-- RECYCLE HUB - COMPREHENSIVE SQL QUERIES
-- All Database Operations and Business Logic
-- =====================================================

-- =====================================================
-- USER MANAGEMENT QUERIES
-- =====================================================

-- 1. Register new user
INSERT INTO users (email, password_hash, name, user_type, phone, address, city, state, pincode)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id, email, name, user_type, created_at;

-- 2. User login authentication
SELECT id, email, name, user_type, avatar_url, points, total_donations, is_active
FROM users 
WHERE email = $1 AND password_hash = $2 AND is_active = true;

-- 3. Update user profile
UPDATE users 
SET name = $1, phone = $2, address = $3, city = $4, state = $5, pincode = $6, updated_at = CURRENT_TIMESTAMP
WHERE id = $7;

-- 4. Get user by ID
SELECT id, email, name, user_type, avatar_url, phone, address, city, state, pincode, 
       points, total_donations, is_active, created_at
FROM users 
WHERE id = $1;

-- 5. Get all users (Admin)
SELECT id, email, name, user_type, city, state, points, total_donations, 
       is_active, created_at
FROM users 
ORDER BY created_at DESC
LIMIT $1 OFFSET $2;

-- 6. Suspend/Activate user (Admin)
UPDATE users 
SET is_active = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- 7. Get leaderboard
SELECT id, name, avatar_url, points, total_donations
FROM users 
WHERE user_type != 'admin' AND is_active = true
ORDER BY points DESC, total_donations DESC
LIMIT 50;

-- =====================================================
-- PRODUCT MANAGEMENT QUERIES
-- =====================================================

-- 8. Create new product listing
INSERT INTO products (title, description, price, category_id, listing_type, condition, 
                     seller_id, location, latitude, longitude)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id;

-- 9. Add product images
INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
VALUES ($1, $2, $3, $4);

-- 10. Get products by listing type
SELECT p.id, p.title, p.description, p.price, p.condition, p.location, p.views_count,
       p.likes_count, p.created_at, p.is_available,
       c.name as category_name,
       u.id as seller_id, u.name as seller_name, u.avatar_url as seller_avatar,
       (SELECT AVG(rating) FROM reviews WHERE reviewee_id = u.id) as seller_rating,
       ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as images
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN users u ON p.seller_id = u.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.listing_type = $1 AND p.is_available = true
GROUP BY p.id, c.name, u.id, u.name, u.avatar_url
ORDER BY p.created_at DESC
LIMIT $2 OFFSET $3;

-- 11. Get product by ID
SELECT p.id, p.title, p.description, p.price, p.condition, p.location, p.views_count,
       p.likes_count, p.created_at, p.is_available,
       c.name as category_name,
       u.id as seller_id, u.name as seller_name, u.avatar_url as seller_avatar,
       (SELECT AVG(rating) FROM reviews WHERE reviewee_id = u.id) as seller_rating,
       ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as images
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN users u ON p.seller_id = u.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.id = $1
GROUP BY p.id, c.name, u.id, u.name, u.avatar_url;

-- 12. Search products
SELECT p.id, p.title, p.description, p.price, p.condition, p.location, p.created_at,
       c.name as category_name,
       u.name as seller_name,
       ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as images
FROM products p
JOIN categories c ON p.category_id = c.id
JOIN users u ON p.seller_id = u.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.is_available = true 
  AND (p.title ILIKE '%' || $1 || '%' OR p.description ILIKE '%' || $1 || '%')
  AND ($2 = 'all' OR p.listing_type = $2)
  AND ($3 = 'all' OR c.name = $3)
  AND ($4 = 'all' OR p.condition = $4)
  AND ($5 IS NULL OR p.price >= $5)
  AND ($6 IS NULL OR p.price <= $6)
GROUP BY p.id, c.name, u.name
ORDER BY 
  CASE WHEN $7 = 'price_asc' THEN p.price END ASC,
  CASE WHEN $7 = 'price_desc' THEN p.price END DESC,
  CASE WHEN $7 = 'oldest' THEN p.created_at END ASC,
  p.created_at DESC
LIMIT $8 OFFSET $9;

-- 13. Get user's products
SELECT p.id, p.title, p.description, p.price, p.condition, p.listing_type, 
       p.location, p.views_count, p.likes_count, p.created_at, p.is_available,
       c.name as category_name,
       ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as images
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE p.seller_id = $1
GROUP BY p.id, c.name
ORDER BY p.created_at DESC;

-- 14. Update product availability
UPDATE products 
SET is_available = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2 AND seller_id = $3;

-- 15. Increment product views
UPDATE products 
SET views_count = views_count + 1
WHERE id = $1;

-- =====================================================
-- TRANSACTION MANAGEMENT QUERIES
-- =====================================================

-- 16. Create new transaction
INSERT INTO transactions (transaction_id, buyer_id, seller_id, product_id, amount, 
                         delivery_fee, total_amount, payment_method, delivery_option, 
                         delivery_address)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id, transaction_id;

-- 17. Update transaction status
UPDATE transactions 
SET payment_status = $1, delivery_status = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3;

-- 18. Get transaction by ID
SELECT t.id, t.transaction_id, t.amount, t.delivery_fee, t.total_amount,
       t.payment_method, t.payment_status, t.delivery_option, t.delivery_address,
       t.delivery_status, t.created_at,
       p.title as product_title, p.price as product_price,
       buyer.name as buyer_name, buyer.email as buyer_email,
       seller.name as seller_name, seller.email as seller_email
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users buyer ON t.buyer_id = buyer.id
JOIN users seller ON t.seller_id = seller.id
WHERE t.id = $1;

-- 19. Get user's transactions (as buyer)
SELECT t.id, t.transaction_id, t.amount, t.total_amount, t.payment_status, 
       t.delivery_status, t.created_at,
       p.title as product_title,
       seller.name as seller_name
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users seller ON t.seller_id = seller.id
WHERE t.buyer_id = $1
ORDER BY t.created_at DESC;

-- 20. Get user's sales (as seller)
SELECT t.id, t.transaction_id, t.amount, t.total_amount, t.payment_status, 
       t.delivery_status, t.created_at,
       p.title as product_title,
       buyer.name as buyer_name
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users buyer ON t.buyer_id = buyer.id
WHERE t.seller_id = $1
ORDER BY t.created_at DESC;

-- 21. Get all transactions (Admin)
SELECT t.id, t.transaction_id, t.amount, t.total_amount, t.payment_status, 
       t.delivery_status, t.created_at,
       p.title as product_title,
       buyer.name as buyer_name, buyer.email as buyer_email,
       seller.name as seller_name, seller.email as seller_email
FROM transactions t
JOIN products p ON t.product_id = p.id
JOIN users buyer ON t.buyer_id = buyer.id
JOIN users seller ON t.seller_id = seller.id
ORDER BY t.created_at DESC
LIMIT $1 OFFSET $2;

-- =====================================================
-- POINTS SYSTEM QUERIES
-- =====================================================

-- 22. Add points to user
UPDATE users 
SET points = points + $1, 
    total_donations = CASE WHEN $2 = 'donation' THEN total_donations + 1 ELSE total_donations END,
    updated_at = CURRENT_TIMESTAMP
WHERE id = $3;

-- 23. Record points history
INSERT INTO points_history (user_id, points, action_type, description, reference_id)
VALUES ($1, $2, $3, $4, $5);

-- 24. Get user's points history
SELECT points, action_type, description, created_at
FROM points_history
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- =====================================================
-- PICKUP MANAGEMENT QUERIES
-- =====================================================

-- 25. Create pickup request
INSERT INTO pickup_requests (request_id, collector_id, seller_id, product_id, 
                            pickup_address, pickup_date, pickup_time_slot, notes)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING id, request_id;

-- 26. Update pickup status
UPDATE pickup_requests 
SET status = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2;

-- 27. Get pickup requests for collector
SELECT pr.id, pr.request_id, pr.pickup_address, pr.pickup_date, pr.pickup_time_slot,
       pr.status, pr.notes, pr.created_at,
       p.title as product_title, p.description as product_description,
       seller.name as seller_name, seller.phone as seller_phone
FROM pickup_requests pr
JOIN products p ON pr.product_id = p.id
JOIN users seller ON pr.seller_id = seller.id
WHERE pr.collector_id = $1
ORDER BY pr.pickup_date DESC, pr.created_at DESC;

-- 28. Get all pickup requests (Admin)
SELECT pr.id, pr.request_id, pr.pickup_address, pr.pickup_date, pr.status, pr.created_at,
       p.title as product_title,
       collector.name as collector_name,
       seller.name as seller_name
FROM pickup_requests pr
JOIN products p ON pr.product_id = p.id
JOIN users collector ON pr.collector_id = collector.id
JOIN users seller ON pr.seller_id = seller.id
ORDER BY pr.created_at DESC
LIMIT $1 OFFSET $2;

-- =====================================================
-- FAVORITES MANAGEMENT QUERIES
-- =====================================================

-- 29. Add to favorites
INSERT INTO favorites (user_id, product_id)
VALUES ($1, $2)
ON CONFLICT (user_id, product_id) DO NOTHING;

-- 30. Remove from favorites
DELETE FROM favorites
WHERE user_id = $1 AND product_id = $2;

-- 31. Get user's favorites
SELECT p.id, p.title, p.price, p.condition, p.location, p.created_at,
       c.name as category_name,
       u.name as seller_name,
       ARRAY_AGG(pi.image_url ORDER BY pi.sort_order) as images
FROM favorites f
JOIN products p ON f.product_id = p.id
JOIN categories c ON p.category_id = c.id
JOIN users u ON p.seller_id = u.id
LEFT JOIN product_images pi ON p.id = pi.product_id
WHERE f.user_id = $1 AND p.is_available = true
GROUP BY p.id, c.name, u.name, f.created_at
ORDER BY f.created_at DESC;

-- =====================================================
-- MESSAGING QUERIES
-- =====================================================

-- 32. Send message
INSERT INTO messages (sender_id, receiver_id, product_id, message)
VALUES ($1, $2, $3, $4)
RETURNING id, created_at;

-- 33. Get conversation
SELECT m.id, m.message, m.is_read, m.created_at,
       sender.name as sender_name,
       receiver.name as receiver_name
FROM messages m
JOIN users sender ON m.sender_id = sender.id
JOIN users receiver ON m.receiver_id = receiver.id
WHERE (m.sender_id = $1 AND m.receiver_id = $2) 
   OR (m.sender_id = $2 AND m.receiver_id = $1)
   AND ($3 IS NULL OR m.product_id = $3)
ORDER BY m.created_at ASC;

-- 34. Mark messages as read
UPDATE messages 
SET is_read = true
WHERE receiver_id = $1 AND sender_id = $2 AND is_read = false;

-- =====================================================
-- ADMIN ANALYTICS QUERIES
-- =====================================================

-- 35. Get platform statistics
SELECT 
  (SELECT COUNT(*) FROM users WHERE user_type != 'admin') as total_users,
  (SELECT COUNT(*) FROM users WHERE user_type = 'scrap_collector') as total_collectors,
  (SELECT COUNT(*) FROM products WHERE is_available = true) as total_products,
  (SELECT COUNT(*) FROM transactions) as total_transactions,
  (SELECT COALESCE(SUM(total_amount), 0) FROM transactions WHERE payment_status = 'completed') as total_revenue,
  (SELECT COUNT(*) FROM pickup_requests) as total_pickups;

-- 36. Get category-wise product distribution
SELECT c.name, COUNT(p.id) as product_count,
       ROUND(COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM products), 2) as percentage
FROM categories c
LEFT JOIN products p ON c.id = p.category_id AND p.is_available = true
GROUP BY c.id, c.name
ORDER BY product_count DESC;

-- 37. Get monthly transaction trends
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as transaction_count,
  SUM(total_amount) as total_revenue
FROM transactions
WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month;

-- 38. Get top performing users
SELECT u.id, u.name, u.email, u.points, u.total_donations,
       COUNT(p.id) as total_listings,
       COUNT(t.id) as total_sales,
       COALESCE(SUM(t.total_amount), 0) as total_earnings
FROM users u
LEFT JOIN products p ON u.id = p.seller_id
LEFT JOIN transactions t ON u.id = t.seller_id AND t.payment_status = 'completed'
WHERE u.user_type != 'admin'
GROUP BY u.id, u.name, u.email, u.points, u.total_donations
ORDER BY u.points DESC, total_earnings DESC
LIMIT 20;

-- =====================================================
-- CLEANUP AND MAINTENANCE QUERIES
-- =====================================================

-- 39. Archive old transactions (older than 2 years)
UPDATE transactions 
SET delivery_status = 'archived'
WHERE created_at < CURRENT_DATE - INTERVAL '2 years'
  AND delivery_status = 'delivered';

-- 40. Clean up expired product listings (older than 6 months and not sold)
UPDATE products 
SET is_available = false
WHERE created_at < CURRENT_DATE - INTERVAL '6 months'
  AND is_available = true
  AND id NOT IN (SELECT DISTINCT product_id FROM transactions);

-- =====================================================
-- BACKUP AND RESTORE QUERIES
-- =====================================================

-- 41. Create backup of user data
CREATE TABLE users_backup AS 
SELECT * FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '1 year';

-- 42. Create backup of transaction data
CREATE TABLE transactions_backup AS 
SELECT * FROM transactions WHERE created_at >= CURRENT_DATE - INTERVAL '1 year';

-- =====================================================
-- PERFORMANCE OPTIMIZATION QUERIES
-- =====================================================

-- 43. Analyze table statistics
ANALYZE users;
ANALYZE products;
ANALYZE transactions;
ANALYZE pickup_requests;

-- 44. Vacuum tables for performance
VACUUM ANALYZE users;
VACUUM ANALYZE products;
VACUUM ANALYZE transactions;

-- =====================================================
-- SECURITY QUERIES
-- =====================================================

-- 45. Log admin actions
INSERT INTO admin_logs (admin_id, action, target_type, target_id, details, ip_address)
VALUES ($1, $2, $3, $4, $5, $6);

-- 46. Get admin activity logs
SELECT al.action, al.target_type, al.target_id, al.details, al.ip_address, al.created_at,
       u.name as admin_name
FROM admin_logs al
JOIN users u ON al.admin_id = u.id
ORDER BY al.created_at DESC
LIMIT $1 OFFSET $2;

-- =====================================================
-- NOTIFICATION QUERIES
-- =====================================================

-- 47. Create notification
INSERT INTO notifications (user_id, title, message, type, reference_id)
VALUES ($1, $2, $3, $4, $5);

-- 48. Get user notifications
SELECT id, title, message, type, is_read, created_at
FROM notifications
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- 49. Mark notification as read
UPDATE notifications 
SET is_read = true
WHERE id = $1 AND user_id = $2;

-- 50. Delete old notifications (older than 30 days)
DELETE FROM notifications
WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
  AND is_read = true;