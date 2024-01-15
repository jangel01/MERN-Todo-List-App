import Pagination from 'react-bootstrap/Pagination';

interface AdvancedPaginationProps {
    currentPage: number,
    totalPages: number,
    onPageChange: (pageNumber: number) => void,
}

const AdvancedPagination = ({ currentPage, totalPages, onPageChange }: AdvancedPaginationProps) => {

    const paginationItems = () => {
        const items: JSX.Element[] = [];
        const maxVisiblePages = 5;

        if (totalPages < maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
                        {i}
                    </Pagination.Item>
                )
            }
        } else {
            const startEllipsis = currentPage > 3;
            const endEllipsis = currentPage < totalPages - 2;

            let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
            let endPage = startPage + maxVisiblePages - 1;

            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(endPage - maxVisiblePages + 1, 1);
            }

            if (startEllipsis) {
                items.push(<Pagination.Ellipsis key="start" onClick={() => onPageChange(startPage - 1)}/>)
            }

            for (let i = startPage; i <= endPage; i++) {
                items.push(
                    <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}> 
                        {i}
                    </Pagination.Item>
                )
            }

            if (endEllipsis) {
                items.push(<Pagination.Ellipsis key="end" onClick={() => onPageChange(endPage + 1)}/>)
            }
        }

        return items;
    };

    return (
        <Pagination className='justify-content-center py-5'>
            <Pagination.First onClick={() => onPageChange(1)}/>
            <Pagination.Prev onClick={() => onPageChange(Math.max(currentPage - 1, 1))}/>

            {paginationItems()}

            <Pagination.Next onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}/>
            <Pagination.Last onClick={() => onPageChange(totalPages)}/>
        </Pagination>
    );
}

export default AdvancedPagination;