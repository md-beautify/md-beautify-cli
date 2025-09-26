# 多语言代码高亮测试

## JavaScript

```javascript
// ES6+ 语法
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

// 箭头函数和解构
const processUser = ({ name, age, email }) => {
  return {
    fullName: name.toUpperCase(),
    isAdult: age >= 18,
    contact: email || 'No email provided'
  };
};
```

## Python

```python
# 装饰器示例
def timer_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.2f} seconds")
        return result
    return wrapper

@timer_decorator
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 列表推导式
squares = [x**2 for x in range(10) if x % 2 == 0]
```

## Java

```java
import java.util.*;

public class BinarySearchTree {
    private Node root;
    
    private class Node {
        int data;
        Node left, right;
        
        Node(int data) {
            this.data = data;
            this.left = this.right = null;
        }
    }
    
    public void insert(int data) {
        root = insertRec(root, data);
    }
    
    private Node insertRec(Node root, int data) {
        if (root == null) {
            return new Node(data);
        }
        
        if (data < root.data) {
            root.left = insertRec(root.left, data);
        } else if (data > root.data) {
            root.right = insertRec(root.right, data);
        }
        
        return root;
    }
}
```

## C++

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

template<typename T>
class SmartPointer {
private:
    T* ptr;
    
public:
    explicit SmartPointer(T* p = nullptr) : ptr(p) {}
    
    ~SmartPointer() {
        delete ptr;
    }
    
    T& operator*() { return *ptr; }
    T* operator->() { return ptr; }
    
    // 禁用拷贝构造和赋值
    SmartPointer(const SmartPointer&) = delete;
    SmartPointer& operator=(const SmartPointer&) = delete;
    
    // 启用移动语义
    SmartPointer(SmartPointer&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
};
```

## HTML/CSS

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Design</title>
    <style>
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        
        @media (max-width: 768px) {
            .container {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <article class="card">
            <h2>Card Title</h2>
            <p>Card content goes here...</p>
        </article>
    </div>
</body>
</html>
```

## SQL

```sql
-- 复杂查询示例
SELECT 
    u.id,
    u.username,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_spent,
    AVG(o.total_amount) as avg_order_value
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2023-01-01'
    AND u.status = 'active'
GROUP BY u.id, u.username, u.email
HAVING COUNT(o.id) > 5
ORDER BY total_spent DESC
LIMIT 10;

-- 窗口函数
SELECT 
    product_id,
    sale_date,
    amount,
    SUM(amount) OVER (PARTITION BY product_id ORDER BY sale_date) as running_total
FROM sales;
```

## Bash

```bash
#!/bin/bash

# 自动备份脚本
BACKUP_DIR="/backup/$(date +%Y%m%d)"
LOG_FILE="/var/log/backup.log"

echo "Starting backup at $(date)" >> $LOG_FILE

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份重要文件
tar -czf "$BACKUP_DIR/etc_backup.tar.gz" /etc
tar -czf "$BACKUP_DIR/home_backup.tar.gz" /home

# 清理7天前的备份
find /backup -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed at $(date)" >> $LOG_FILE

# 发送邮件通知
mail -s "Backup Status" admin@example.com < $LOG_FILE
```

## TypeScript

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

enum Role {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator'
}

class UserService {
    private apiUrl: string;
    
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }
    
    async getUser(id: number): Promise<User> {
        const response = await fetch(`${this.apiUrl}/users/${id}`);
        if (!response.ok) {
            throw new Error(`User not found: ${id}`);
        }
        return response.json();
    }
    
    hasPermission(user: User, role: Role): boolean {
        return user.roles.includes(role);
    }
}
```