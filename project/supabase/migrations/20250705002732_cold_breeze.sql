-- =====================================================
-- RECYCLE HUB - STORED PROCEDURES & FUNCTIONS
-- Advanced Database Operations and Business Logic
-- =====================================================

-- =====================================================
-- USER MANAGEMENT PROCEDURES
-- =====================================================

-- 1. Complete user registration with validation
CREATE OR REPLACE FUNCTION register_user(
    p_email VARCHAR(255),
    p_password_hash VARCHAR(255),
    p_name VARCHAR(255),
    p_user_type VARCHAR(20),
    p_phone VARCHAR(20) DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_city VARCHAR(100) DEFAULT NULL,
    p_state VARCHAR(100) DEFAULT NULL,
    p_pincode VARCHAR(10) DEFAULT NULL
)
RETURNS TABLE(
    user_id UUID,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    new_user_id UUID;
BEGIN
    -- Check if email already exists
    IF EXISTS (SELECT 1 FROM users WHERE email = p_email) THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, 'Email already registered';
        RETURN;
    END IF;

    -- Validate user type
    IF p_user_type NOT IN ('normal', 'scrap_collector') THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid user type';
        RETURN;
    END IF;

    -- Insert new user
    INSERT INTO users (email, password_hash, name, user_type, phone, address, city, state, pincode)
    VALUES (p_email, p_password_hash, p_name, p_user_type, p_phone, p_address, p_city, p_state, p_pincode)
    RETURNING id INTO new_user_id;

    -- Create welcome notification
    INSERT INTO notifications (user_id, title, message, type)
    VALUES (new_user_id, 'Welcome to Recycle Hub!', 'Thank you for joining our sustainable community.', 'welcome');

    RETURN QUERY SELECT new_user_id, TRUE, 'User registered successfully';
END;
$$ LANGUAGE plpgsql;

-- 2. Award points with validation and history
CREATE OR REPLACE FUNCTION award_points(
    p_user_id UUID,
    p_points INTEGER,
    p_action_type VARCHAR(50),
    p_description TEXT,
    p_reference_id UUID DEFAULT NULL
)
RETURNS TABLE(
    success BOOLEAN,
    new_total_points INTEGER,
    message TEXT
) AS $$
DECLARE
    current_points INTEGER;
    new_points INTEGER;
BEGIN
    -- Get current points
    SELECT points INTO current_points FROM users WHERE id = p_user_id;
    
    IF current_points IS NULL THEN
        RETURN QUERY SELECT FALSE, 0, 'User not found';
        RETURN;
    END IF;

    -- Calculate new points total
    new_points := current_points + p_points;

    -- Update user points
    UPDATE users 
    SET points = new_points,
        total_donations = CASE WHEN p_action_type = 'free_donation' THEN total_donations + 1 ELSE total_donations END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_user_id;

    -- Record in points history
    INSERT INTO points_history (user_id, points, action_type, description, reference_id)
    VALUES (p_user_id, p_points, p_action_type, p_description, p_reference_id);

    -- Create notification for significant point awards
    IF p_points >= 50 THEN
        INSERT INTO notifications (user_id, title, message, type, reference_id)
        VALUES (p_user_id, 'Points Earned!', 
                FORMAT('You earned %s points for %s', p_points, p_description), 
                'points', p_reference_id);
    END IF;

    RETURN QUERY SELECT TRUE, new_points, 'Points awarded successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PRODUCT MANAGEMENT PROCEDURES
-- =====================================================

-- 3. Create product listing with images
CREATE OR REPLACE FUNCTION create_product_listing(
    p_title VARCHAR(255),
    p_description TEXT,
    p_price DECIMAL(10,2),
    p_category_name VARCHAR(100),
    p_listing_type VARCHAR(20),
    p_condition VARCHAR(20),
    p_seller_id UUID,
    p_location VARCHAR(255),
    p_latitude DECIMAL(10,8) DEFAULT NULL,
    p_longitude DECIMAL(11,8) DEFAULT NULL,
    p_image_urls TEXT[]
)
RETURNS TABLE(
    product_id UUID,
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    new_product_id UUID;
    category_id UUID;
    img_url TEXT;
    img_index INTEGER := 0;
BEGIN
    -- Get category ID
    SELECT id INTO category_id FROM categories WHERE name = p_category_name;
    
    IF category_id IS NULL THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid category';
        RETURN;
    END IF;

    -- Validate listing type
    IF p_listing_type NOT IN ('thrift', 'used_books', 'reuse', 'scrap') THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid listing type';
        RETURN;
    END IF;

    -- Validate condition
    IF p_condition NOT IN ('excellent', 'good', 'fair') THEN
        RETURN QUERY SELECT NULL::UUID, FALSE, 'Invalid condition';
        RETURN;
    END IF;

    -- For reuse items, price should be 0
    IF p_listing_type = 'reuse' AND p_price != 0 THEN
        p_price := 0;
    END IF;

    -- Insert product
    INSERT INTO products (title, description, price, category_id, listing_type, condition, 
                         seller_id, location, latitude, longitude)
    VALUES (p_title, p_description, p_price, category_id, p_listing_type, p_condition, 
            p_seller_id, p_location, p_latitude, p_longitude)
    RETURNING id INTO new_product_id;

    -- Insert images
    FOREACH img_url IN ARRAY p_image_urls
    LOOP
        INSERT INTO product_images (product_id, image_url, is_primary, sort_order)
        VALUES (new_product_id, img_url, (img_index = 0), img_index);
        img_index := img_index + 1;
    END LOOP;

    -- Create notification for seller
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES (p_seller_id, 'Product Listed!', 
            FORMAT('Your product "%s" has been listed successfully', p_title), 
            'product_listed', new_product_id);

    RETURN QUERY SELECT new_product_id, TRUE, 'Product listed successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRANSACTION PROCEDURES
-- =====================================================

-- 4. Process complete transaction
CREATE OR REPLACE FUNCTION process_transaction(
    p_buyer_id UUID,
    p_product_id UUID,
    p_payment_method VARCHAR(20),
    p_delivery_option VARCHAR(20),
    p_delivery_address TEXT DEFAULT NULL,
    p_delivery_fee DECIMAL(10,2) DEFAULT 0
)
RETURNS TABLE(
    transaction_id VARCHAR(50),
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    new_transaction_id VARCHAR(50);
    product_price DECIMAL(10,2);
    seller_id UUID;
    total_amount DECIMAL(10,2);
    product_title VARCHAR(255);
    is_free_item BOOLEAN := FALSE;
BEGIN
    -- Get product details
    SELECT price, seller_id, title, is_available 
    INTO product_price, seller_id, product_title, is_free_item
    FROM products 
    WHERE id = p_product_id;

    -- Validate product exists and is available
    IF seller_id IS NULL THEN
        RETURN QUERY SELECT NULL, FALSE, 'Product not found';
        RETURN;
    END IF;

    IF NOT is_free_item THEN
        RETURN QUERY SELECT NULL, FALSE, 'Product not available';
        RETURN;
    END IF;

    -- Check if buyer is not the seller
    IF p_buyer_id = seller_id THEN
        RETURN QUERY SELECT NULL, FALSE, 'Cannot buy your own product';
        RETURN;
    END IF;

    -- Calculate total amount
    total_amount := product_price + p_delivery_fee;
    
    -- Check if it's a free item
    IF product_price = 0 THEN
        is_free_item := TRUE;
        total_amount := p_delivery_fee; -- Only delivery fee for free items
    END IF;

    -- Generate transaction ID
    new_transaction_id := 'TXN' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || 
                         LPAD(EXTRACT(MICROSECONDS FROM CURRENT_TIMESTAMP)::TEXT, 6, '0');

    -- Insert transaction
    INSERT INTO transactions (transaction_id, buyer_id, seller_id, product_id, amount, 
                             delivery_fee, total_amount, payment_method, delivery_option, 
                             delivery_address, payment_status)
    VALUES (new_transaction_id, p_buyer_id, seller_id, p_product_id, product_price, 
            p_delivery_fee, total_amount, p_payment_method, p_delivery_option, 
            p_delivery_address, 'pending');

    -- Mark product as unavailable
    UPDATE products SET is_available = FALSE WHERE id = p_product_id;

    -- Award points for free item donation
    IF is_free_item THEN
        PERFORM award_points(seller_id, 50, 'free_donation', 
                           FORMAT('Free donation: %s', product_title), p_product_id);
    END IF;

    -- Create notifications
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES 
        (p_buyer_id, 'Order Placed!', 
         FORMAT('Your order for "%s" has been placed', product_title), 
         'order_placed', p_product_id),
        (seller_id, 'New Order!', 
         FORMAT('You have a new order for "%s"', product_title), 
         'order_received', p_product_id);

    RETURN QUERY SELECT new_transaction_id, TRUE, 'Transaction processed successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PICKUP MANAGEMENT PROCEDURES
-- =====================================================

-- 5. Schedule pickup request
CREATE OR REPLACE FUNCTION schedule_pickup(
    p_collector_id UUID,
    p_product_id UUID,
    p_pickup_date DATE,
    p_pickup_time_slot VARCHAR(20),
    p_notes TEXT DEFAULT NULL
)
RETURNS TABLE(
    request_id VARCHAR(50),
    success BOOLEAN,
    message TEXT
) AS $$
DECLARE
    new_request_id VARCHAR(50);
    seller_id UUID;
    product_title VARCHAR(255);
    pickup_address TEXT;
BEGIN
    -- Get product and seller details
    SELECT p.seller_id, p.title, u.address || ', ' || u.city || ', ' || u.state
    INTO seller_id, product_title, pickup_address
    FROM products p
    JOIN users u ON p.seller_id = u.id
    WHERE p.id = p_product_id AND p.listing_type = 'scrap' AND p.is_available = TRUE;

    -- Validate product exists and is scrap type
    IF seller_id IS NULL THEN
        RETURN QUERY SELECT NULL, FALSE, 'Scrap item not found or not available';
        RETURN;
    END IF;

    -- Validate collector type
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = p_collector_id AND user_type = 'scrap_collector') THEN
        RETURN QUERY SELECT NULL, FALSE, 'Only scrap collectors can schedule pickups';
        RETURN;
    END IF;

    -- Generate request ID
    new_request_id := 'PU' || TO_CHAR(CURRENT_TIMESTAMP, 'YYYYMMDDHH24MISS') || 
                     LPAD(EXTRACT(MICROSECONDS FROM CURRENT_TIMESTAMP)::TEXT, 6, '0');

    -- Insert pickup request
    INSERT INTO pickup_requests (request_id, collector_id, seller_id, product_id, 
                                pickup_address, pickup_date, pickup_time_slot, notes)
    VALUES (new_request_id, p_collector_id, seller_id, p_product_id, 
            pickup_address, p_pickup_date, p_pickup_time_slot, p_notes);

    -- Create notifications
    INSERT INTO notifications (user_id, title, message, type, reference_id)
    VALUES 
        (p_collector_id, 'Pickup Scheduled!', 
         FORMAT('Pickup scheduled for "%s" on %s', product_title, p_pickup_date), 
         'pickup_scheduled', p_product_id),
        (seller_id, 'Pickup Request!', 
         FORMAT('A collector has scheduled pickup for "%s" on %s', product_title, p_pickup_date), 
         'pickup_requested', p_product_id);

    RETURN QUERY SELECT new_request_id, TRUE, 'Pickup scheduled successfully';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ANALYTICS FUNCTIONS
-- =====================================================

-- 6. Get comprehensive platform analytics
CREATE OR REPLACE FUNCTION get_platform_analytics(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    metric_name VARCHAR(50),
    metric_value NUMERIC,
    metric_description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 'total_users'::VARCHAR(50), COUNT(*)::NUMERIC, 'Total registered users'::TEXT
    FROM users WHERE user_type != 'admin' AND created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'total_products'::VARCHAR(50), COUNT(*)::NUMERIC, 'Total products listed'::TEXT
    FROM products WHERE created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'total_transactions'::VARCHAR(50), COUNT(*)::NUMERIC, 'Total transactions'::TEXT
    FROM transactions WHERE created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'total_revenue'::VARCHAR(50), COALESCE(SUM(total_amount), 0)::NUMERIC, 'Total revenue generated'::TEXT
    FROM transactions WHERE payment_status = 'completed' AND created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'free_items_donated'::VARCHAR(50), COUNT(*)::NUMERIC, 'Free items donated'::TEXT
    FROM products WHERE listing_type = 'reuse' AND created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'scrap_items_collected'::VARCHAR(50), COUNT(*)::NUMERIC, 'Scrap items collected'::TEXT
    FROM pickup_requests WHERE status = 'completed' AND created_at BETWEEN p_start_date AND p_end_date
    
    UNION ALL
    
    SELECT 'co2_saved_kg'::VARCHAR(50), (COUNT(*) * 2.5)::NUMERIC, 'Estimated CO2 saved in kg'::TEXT
    FROM products WHERE listing_type IN ('reuse', 'thrift', 'used_books') AND created_at BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAINTENANCE FUNCTIONS
-- =====================================================

-- 7. Clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS TABLE(
    cleanup_type VARCHAR(50),
    records_affected INTEGER,
    message TEXT
) AS $$
DECLARE
    notifications_deleted INTEGER;
    old_transactions INTEGER;
    expired_products INTEGER;
BEGIN
    -- Delete old read notifications (older than 30 days)
    DELETE FROM notifications 
    WHERE created_at < CURRENT_DATE - INTERVAL '30 days' AND is_read = TRUE;
    GET DIAGNOSTICS notifications_deleted = ROW_COUNT;
    
    -- Archive old completed transactions (older than 1 year)
    UPDATE transactions 
    SET delivery_status = 'archived'
    WHERE created_at < CURRENT_DATE - INTERVAL '1 year' 
      AND payment_status = 'completed' 
      AND delivery_status = 'delivered';
    GET DIAGNOSTICS old_transactions = ROW_COUNT;
    
    -- Mark expired products as unavailable (older than 6 months, not sold)
    UPDATE products 
    SET is_available = FALSE
    WHERE created_at < CURRENT_DATE - INTERVAL '6 months'
      AND is_available = TRUE
      AND id NOT IN (SELECT DISTINCT product_id FROM transactions);
    GET DIAGNOSTICS expired_products = ROW_COUNT;
    
    RETURN QUERY VALUES 
        ('notifications'::VARCHAR(50), notifications_deleted, 'Old notifications deleted'::TEXT),
        ('transactions'::VARCHAR(50), old_transactions, 'Old transactions archived'::TEXT),
        ('products'::VARCHAR(50), expired_products, 'Expired products marked unavailable'::TEXT);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEARCH FUNCTIONS
-- =====================================================

-- 8. Advanced product search with ranking
CREATE OR REPLACE FUNCTION search_products(
    p_search_term TEXT,
    p_listing_type VARCHAR(20) DEFAULT 'all',
    p_category VARCHAR(100) DEFAULT 'all',
    p_condition VARCHAR(20) DEFAULT 'all',
    p_min_price DECIMAL(10,2) DEFAULT NULL,
    p_max_price DECIMAL(10,2) DEFAULT NULL,
    p_location VARCHAR(255) DEFAULT NULL,
    p_sort_by VARCHAR(20) DEFAULT 'relevance',
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE(
    product_id UUID,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2),
    condition VARCHAR(20),
    location VARCHAR(255),
    category_name VARCHAR(100),
    seller_name VARCHAR(255),
    seller_rating NUMERIC,
    images TEXT[],
    relevance_score NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.condition,
        p.location,
        c.name,
        u.name,
        COALESCE((SELECT AVG(rating) FROM reviews WHERE reviewee_id = u.id), 0),
        ARRAY_AGG(pi.image_url ORDER BY pi.sort_order),
        -- Relevance scoring
        (
            CASE WHEN p.title ILIKE '%' || p_search_term || '%' THEN 3 ELSE 0 END +
            CASE WHEN p.description ILIKE '%' || p_search_term || '%' THEN 1 ELSE 0 END +
            CASE WHEN p.is_featured THEN 2 ELSE 0 END +
            CASE WHEN p.created_at > CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END
        )::NUMERIC,
        p.created_at
    FROM products p
    JOIN categories c ON p.category_id = c.id
    JOIN users u ON p.seller_id = u.id
    LEFT JOIN product_images pi ON p.id = pi.product_id
    WHERE p.is_available = TRUE
      AND (p_search_term IS NULL OR p_search_term = '' OR 
           p.title ILIKE '%' || p_search_term || '%' OR 
           p.description ILIKE '%' || p_search_term || '%')
      AND (p_listing_type = 'all' OR p.listing_type = p_listing_type)
      AND (p_category = 'all' OR c.name = p_category)
      AND (p_condition = 'all' OR p.condition = p_condition)
      AND (p_min_price IS NULL OR p.price >= p_min_price)
      AND (p_max_price IS NULL OR p.price <= p_max_price)
      AND (p_location IS NULL OR p.location ILIKE '%' || p_location || '%')
    GROUP BY p.id, c.name, u.name, u.id
    ORDER BY 
        CASE WHEN p_sort_by = 'relevance' THEN 
            (CASE WHEN p.title ILIKE '%' || p_search_term || '%' THEN 3 ELSE 0 END +
             CASE WHEN p.description ILIKE '%' || p_search_term || '%' THEN 1 ELSE 0 END +
             CASE WHEN p.is_featured THEN 2 ELSE 0 END +
             CASE WHEN p.created_at > CURRENT_DATE - INTERVAL '7 days' THEN 1 ELSE 0 END)
        END DESC,
        CASE WHEN p_sort_by = 'price_asc' THEN p.price END ASC,
        CASE WHEN p_sort_by = 'price_desc' THEN p.price END DESC,
        CASE WHEN p_sort_by = 'newest' THEN p.created_at END DESC,
        CASE WHEN p_sort_by = 'oldest' THEN p.created_at END ASC,
        p.created_at DESC
    LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;