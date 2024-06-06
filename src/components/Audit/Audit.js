import React, { useEffect } from 'react';
import Breadcrumbs from '../Layout/Breadcrumbs';
import { Card, CardBody, CardHeader } from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { observer } from 'mobx-react';
import auditStore from '../../stores/auditStore';
import LoadingOverlay from '../Common/LoadingOverlay';
import Filters from './Filters';
import ErrorModal from '../Common/ErrorModal';
import { Paginate } from 'components/Common/Paginate';

import { auditColumn } from './auditColums';

const Audit = observer(() => {
  const itemsPerPage = auditStore.events?.take;

  useEffect(() => {
    (async () => {
      try {
        await auditStore.getAllStats();
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    })();
  }, []);

  const handlePageClick = (selected) => {
    auditStore.pageChange(itemsPerPage, selected * itemsPerPage);
  };

  return (
    <div className="p-3 position-relative w-100 h-100 overflow-auto">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Audit', href: '/admin/audit' },
        ]}
      />

      <Filters />

      <Card>
        <CardHeader className="bg-white d-flex justify-content-between align-items-center">
          Audit Log
        </CardHeader>

        <CardBody className="position-relative">
          {auditStore.loading && <LoadingOverlay />}
          <BootstrapTable
            wrapperClasses="table-scroll max-height-400"
            keyField="id"
            bootstrap4
            data={auditStore.events.items || []}
            columns={auditColumn}
            size="lg"
            className="table-hover"
            rowClasses="custom-table-style"
            hover
          />
          <Paginate
            previousLabel="<"
            nextLabel=" > "
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={Math.ceil(auditStore.events?.total / itemsPerPage) || 0}
            className="react-paginate"
            pageClassName="li-button"
            itemsPerPage={itemsPerPage}
            handlePageClick={handlePageClick}
          />
        </CardBody>
      </Card>
    </div>
  );
});

export default Audit;
