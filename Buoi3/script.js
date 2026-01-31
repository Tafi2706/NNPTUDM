// Biến toàn cục để lưu trạng thái
let allProducts = [];   // Chứa toàn bộ dữ liệu từ API
let filteredProducts = []; // Chứa dữ liệu sau khi lọc/tìm kiếm
let currentPage = 1;
let itemsPerPage = 10;  // Mặc định 10 phần tử/trang

// 1. Hàm getall: Gọi API lấy dữ liệu
async function getAllProducts() {
    try {
        const response = await fetch('https://api.escuelajs.co/api/v1/products');
        const data = await response.json();
        
        allProducts = data;
        filteredProducts = data; // Ban đầu chưa lọc gì cả
        
        renderTable(); // Hiển thị dữ liệu lần đầu
        updatePaginationInfo();
    } catch (error) {
        console.error("Lỗi khi gọi API:", error);
    }
}

// 2. Hàm renderTable: Hiển thị dữ liệu ra bảng theo phân trang
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ

    // Tính toán vị trí bắt đầu và kết thúc cho trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Cắt dữ liệu cho trang hiện tại
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productsToShow.forEach(product => {
        // Xử lý ảnh: API này trả về mảng ảnh, lấy ảnh đầu tiên hoặc ảnh lỗi nếu rỗng
        // Lưu ý: Một số ảnh API này bị lỗi định dạng ["..."], cần xử lý chuỗi nếu cần thiết.
        let imgUrl = product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/80';
        
        // Clean url nếu bị dính ngoặc vuông do lỗi dữ liệu từ API này đôi khi gặp
        if (imgUrl.startsWith('["') && imgUrl.endsWith('"]')) {
            imgUrl = imgUrl.replace('["', '').replace('"]', '');
        } else if (imgUrl.startsWith('["')) {
             imgUrl = imgUrl.replace('["', '').replace('"]', '');
        }

        const row = `
            <tr>
                <td>${product.id}</td>
                <td><img src="${imgUrl}" alt="${product.title}" class="product-img"></td>
                <td>${product.title}</td>
                <td>$${product.price}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    updatePaginationInfo();
}

// 3. Xử lý Tìm kiếm (onChange)
const searchInput = document.getElementById('searchInput');

// Sự kiện 'input' sẽ kích hoạt ngay khi gõ. Nếu muốn đúng 'onChange' (khi enter hoặc blur), đổi thành 'change'
searchInput.addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    
    // Lọc dữ liệu từ danh sách gốc
    filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(keyword)
    );

    currentPage = 1; // Reset về trang 1 khi tìm kiếm
    renderTable();
});

// 4. Xử lý Thay đổi số lượng hiển thị (5, 10, 20)
document.getElementById('pageSizeSelect').addEventListener('change', (e) => {
    itemsPerPage = parseInt(e.target.value);
    currentPage = 1; // Reset về trang 1
    renderTable();
});

// 5. Xử lý Sắp xếp (Tăng/Giảm theo Giá và Tên)
function sortData(key, direction) {
    filteredProducts.sort((a, b) => {
        if (key === 'price') {
            return direction === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (key === 'title') {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleA < titleB) return direction === 'asc' ? -1 : 1;
            if (titleA > titleB) return direction === 'asc' ? 1 : -1;
            return 0;
        }
    });
    renderTable();
}

// 6. Xử lý Phân trang (Next/Prev)
function changePage(step) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const newPage = currentPage + step;

    if (newPage >= 1 && newPage <= totalPages) {
        currentPage = newPage;
        renderTable();
    }
}

function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    // Xử lý trường hợp không có dữ liệu
    const displayPage = totalPages === 0 ? 0 : currentPage;
    document.getElementById('pageInfo').innerText = `Trang ${displayPage} / ${totalPages}`;
    
    // Disable nút nếu ở đầu hoặc cuối
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages || totalPages === 0;
}

// Khởi chạy khi trang tải xong
getAllProducts();