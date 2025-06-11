CREATE TYPE user_role AS ENUM ('user', 'admin', 'restorer');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE exhibition_status AS ENUM ('upcoming', 'ongoing', 'ended');
CREATE TYPE restoration_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- 文物表
CREATE TABLE artifacts (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    era VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    category VARCHAR(255) NOT NULL,
    description TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 展览表
CREATE TABLE exhibitions (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    image VARCHAR(500),
    status exhibition_status NOT NULL,
    location VARCHAR(255) NOT NULL,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 展览文物关联表
CREATE TABLE exhibition_artifacts (
    exhibition_id VARCHAR(255),
    artifact_id VARCHAR(255),
    PRIMARY KEY (exhibition_id, artifact_id),
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

-- 用户表
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    avatar VARCHAR(500),
    role user_role NOT NULL DEFAULT 'user',
    status user_status NOT NULL DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户喜欢的文物表
CREATE TABLE user_artifact_likes (
    user_id VARCHAR(255),
    artifact_id VARCHAR(255),
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, artifact_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE
);

-- 用户喜欢的展览表
CREATE TABLE user_exhibition_likes (
    user_id VARCHAR(255),
    exhibition_id VARCHAR(255),
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, exhibition_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exhibition_id) REFERENCES exhibitions(id) ON DELETE CASCADE
);

-- 文物修复记录表
CREATE TABLE artifact_restorations (
    id VARCHAR(255) PRIMARY KEY,
    artifact_id VARCHAR(255) NOT NULL,
    restorer_id VARCHAR(255) NOT NULL,
    status restoration_status NOT NULL DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    description TEXT,
    notes TEXT,
    before_images JSONB,
    after_images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artifact_id) REFERENCES artifacts(id) ON DELETE CASCADE,
    FOREIGN KEY (restorer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION insert_sample_data()
RETURNS VOID AS $$
DECLARE
    i INTEGER;
    artifact_ids VARCHAR(255)[];
    exhibition_ids VARCHAR(255)[];
    user_ids VARCHAR(255)[];
    restorer_ids VARCHAR(255)[];
BEGIN
    -- 清空现有数据（可选）
    TRUNCATE TABLE artifact_restorations CASCADE;
    TRUNCATE TABLE user_exhibition_likes CASCADE;
    TRUNCATE TABLE user_artifact_likes CASCADE;
    TRUNCATE TABLE exhibition_artifacts CASCADE;
    TRUNCATE TABLE exhibitions CASCADE;
    TRUNCATE TABLE artifacts CASCADE;
    TRUNCATE TABLE users CASCADE;

    -- 插入用户数据
    FOR i IN 1..20 LOOP
        INSERT INTO users (id, username, email, password_hash, full_name, avatar, role, status)
        VALUES (
            'user_' || i,
            'user' || i,
            'user' || i || '@example.com',
            '$2b$10$hash' || i,
            CASE 
                WHEN i <= 15 THEN '用户' || i
                ELSE '修复师' || (i-15)
            END,
            'https://example.com/avatar' || i || '.jpg',
            CASE 
                WHEN i = 1 THEN 'admin'::user_role
                WHEN i > 15 THEN 'restorer'::user_role
                ELSE 'user'::user_role
            END,
            'active'::user_status
        );
    END LOOP;

    -- 收集用户ID
    SELECT ARRAY_AGG(id) INTO user_ids FROM users WHERE role = 'user';
    SELECT ARRAY_AGG(id) INTO restorer_ids FROM users WHERE role = 'restorer';

    -- 插入文物数据
    FOR i IN 1..30 LOOP
        INSERT INTO artifacts (id, name, era, image, category, description, likes)
        VALUES (
            'artifact_' || i,
            CASE (i % 6)
                WHEN 0 THEN '青铜器' || i
                WHEN 1 THEN '陶瓷器' || i
                WHEN 2 THEN '玉器' || i
                WHEN 3 THEN '书画作品' || i
                WHEN 4 THEN '石雕' || i
                ELSE '漆器' || i
            END,
            CASE (i % 5)
                WHEN 0 THEN '商周'
                WHEN 1 THEN '唐朝'
                WHEN 2 THEN '宋朝'
                WHEN 3 THEN '明朝'
                ELSE '清朝'
            END,
            'https://example.com/artifact' || i || '.jpg',
            CASE (i % 6)
                WHEN 0 THEN '青铜器'
                WHEN 1 THEN '陶瓷'
                WHEN 2 THEN '玉器'
                WHEN 3 THEN '书画'
                WHEN 4 THEN '石雕'
                ELSE '漆器'
            END,
            '这是文物' || i || '的详细描述，包含其历史背景和文化价值。',
            FLOOR(RANDOM() * 100)
        );
    END LOOP;

    -- 收集文物ID
    SELECT ARRAY_AGG(id) INTO artifact_ids FROM artifacts;

    -- 插入展览数据
    FOR i IN 1..15 LOOP
        INSERT INTO exhibitions (id, name, description, start_date, end_date, image, status, location, likes)
        VALUES (
            'exhibition_' || i,
            '展览' || i || '：' || 
            CASE (i % 4)
                WHEN 0 THEN '古代青铜艺术'
                WHEN 1 THEN '传统陶瓷文化'
                WHEN 2 THEN '中华玉器精品'
                ELSE '书画名作展'
            END,
            '这是展览' || i || '的详细介绍，展示了丰富的文化内涵。',
            CURRENT_DATE + (i-10) * INTERVAL '1 day',
            CURRENT_DATE + (i+20) * INTERVAL '1 day',
            'https://example.com/exhibition' || i || '.jpg',
            CASE 
                WHEN i <= 5 THEN 'ended'::exhibition_status
                WHEN i <= 10 THEN 'ongoing'::exhibition_status
                ELSE 'upcoming'::exhibition_status
            END,
            '展厅' || ((i % 5) + 1),
            FLOOR(RANDOM() * 200)
        );
    END LOOP;

    -- 收集展览ID
    SELECT ARRAY_AGG(id) INTO exhibition_ids FROM exhibitions;

    -- 插入展览文物关联数据
    FOR i IN 1..40 LOOP
        INSERT INTO exhibition_artifacts (exhibition_id, artifact_id)
        VALUES (
            exhibition_ids[((i-1) % array_length(exhibition_ids, 1)) + 1],
            artifact_ids[((i-1) % array_length(artifact_ids, 1)) + 1]
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- 插入用户文物点赞数据
    FOR i IN 1..50 LOOP
        INSERT INTO user_artifact_likes (user_id, artifact_id)
        VALUES (
            user_ids[((i-1) % array_length(user_ids, 1)) + 1],
            artifact_ids[FLOOR(RANDOM() * array_length(artifact_ids, 1)) + 1]
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- 插入用户展览点赞数据
    FOR i IN 1..35 LOOP
        INSERT INTO user_exhibition_likes (user_id, exhibition_id)
        VALUES (
            user_ids[((i-1) % array_length(user_ids, 1)) + 1],
            exhibition_ids[FLOOR(RANDOM() * array_length(exhibition_ids, 1)) + 1]
        )
        ON CONFLICT DO NOTHING;
    END LOOP;

    -- 插入文物修复记录数据
    FOR i IN 1..25 LOOP
        INSERT INTO artifact_restorations (id, artifact_id, restorer_id, status, start_date, end_date, description, notes, before_images, after_images)
        VALUES (
            'restoration_' || i,
            artifact_ids[((i-1) % array_length(artifact_ids, 1)) + 1],
            restorer_ids[((i-1) % array_length(restorer_ids, 1)) + 1],
            CASE (i % 4)
                WHEN 0 THEN 'completed'::restoration_status
                WHEN 1 THEN 'in_progress'::restoration_status
                WHEN 2 THEN 'pending'::restoration_status
                ELSE 'cancelled'::restoration_status
            END,
            CASE 
                WHEN i % 4 != 2 THEN CURRENT_DATE - (30-i) * INTERVAL '1 day'
                ELSE NULL
            END,
            CASE 
                WHEN i % 4 = 0 THEN CURRENT_DATE - (10-i) * INTERVAL '1 day'
                ELSE NULL
            END,
            '修复项目' || i || '的详细描述，包括损坏情况和修复方案。',
            '修复过程中的注意事项和技术要点。',
            -- 使用 jsonb_build_array 替代字符串拼接
            jsonb_build_array(
                'https://example.com/before' || i || '_1.jpg', 
                'https://example.com/before' || i || '_2.jpg'
            ),
            CASE 
                WHEN i % 4 = 0 THEN 
                    -- 同样，此处也使用 jsonb_build_array
                    jsonb_build_array(
                        'https://example.com/after' || i || '_1.jpg', 
                        'https://example.com/after' || i || '_2.jpg'
                    )
                ELSE NULL
            END
        );
    END LOOP;

    RAISE NOTICE '成功插入示例数据：20个用户，30个文物，15个展览，40个展览文物关联，50个文物点赞，35个展览点赞，25个修复记录';
END;
$$ LANGUAGE plpgsql;

SELECT insert_sample_data();