import React from 'react';
import { observer } from 'mobx-react';
import Breadcrumbs from '../Layout/Breadcrumbs';

const Swagger = observer(() => {
  const { REACT_APP_CCP_API } = process.env;
  return (
    <div className="p-3 position-relative w-100 h-100">
      <Breadcrumbs
        className="mb-3"
        items={[
          { name: 'Home', href: '/admin' },
          { name: 'Swagger', href: '/admin/swagger' },
        ]}
      />

      <div className="w-100 h-100 mb-5">
        <iframe
          title="This is a unique title"
          className="w-100 h-100"
          src={`${REACT_APP_CCP_API}/index.html`}
        ></iframe>
      </div>
    </div>
  );
});

export default Swagger;
