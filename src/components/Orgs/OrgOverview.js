import React, { useEffect, useState, useRef, useCallback } from 'react';
import { observer } from 'mobx-react';
import orgsStore from '../../stores/orgsStore';
import { useParams } from 'react-router-dom';
import LoadingOverlay from '../Common/LoadingOverlay';
import Breadcrumbs from '../Layout/Breadcrumbs';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
} from 'reactstrap';
import ReactSelectComponent from '../Common/ReactSelectComponent';
import referenceStore from '../../stores/referenceStore';

import applicationStore from '../../stores/applicationStore';
import ErrorModal from '../Common/ErrorModal';
import RatingHistory from './RatingHistory';
import ExistingSecurities from './ExistingSecurities';

const initialValues = {
  Moody: '',
  SpRating: '',
  FitchRating: '',
};

const colStyleSp = {
  paddingLeft: 7,
};

const colStyleFitch = {
  paddingLeft: 0,
};
const OrgOverview = observer(() => {
  const params = useParams();
  const isShowSecurities = orgsStore.currentOrg?.type?.label === 'Issuer';

  const [activeTab, setActiveTab] = useState('1');
  const [ratingIds, setRatingIds] = useState({});
  const [values, setValues] = useState(initialValues);
  const [disabled, setDisabled] = useState(true);

  const ref = useRef(null);

  const toggleTab = (tab) => setActiveTab(tab);

  useEffect(() => {
    async function fetchData() {
      try {
        await Promise.all([
          referenceStore.getIndustries(),
          referenceStore.getSectors(),
          referenceStore.getRatings(),
          orgsStore.getOrg(params.code),
          orgsStore.getSecurities(params.code),
        ]);
        //keep initial values
        ref.current = {
          Moody: orgsStore.getLastValueRate('Moody')?.Moody,
          SpRating: orgsStore.getLastValueRate('SpRating')?.SpRating,
          FitchRating: orgsStore.getLastValueRate('FitchRating')?.FitchRating,
        };
      } catch (e) {
        ErrorModal(e?.response?.message);
      }
    }
    fetchData();
  }, [params.code]);

  const isButtonDisabled = useCallback(
    (value, type) => {
      if (!values[type]?.ratingName) {
        return true;
      }
      return ref.current[type] === values[type]?.ratingName;
    },
    [values],
  );

  //compare values with initial
  useEffect(() => {
    if (
      !isButtonDisabled(values, 'Moody') ||
      !isButtonDisabled(values, 'FitchRating') ||
      !isButtonDisabled(values, 'SpRating')
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
    if (Object.keys(ratingIds).length === 0) {
      setDisabled(true);
    }
  }, [isButtonDisabled, ratingIds, values]);

  const moodyRating = referenceStore.ratings?.filter(
    (rating) => rating.providerName === 'Moody',
  );
  const spRating = referenceStore.ratings?.filter(
    (rating) => rating.providerName === 'SpRating',
  );
  const fitchRating = referenceStore.ratings?.filter(
    (rating) => rating.providerName === 'FitchRating',
  );

  const handleEditRating = (rating) => {
    const { providerName, id, label } = rating;
    const rate = orgsStore.getLastValueRate(providerName);
    setRatingIds({ ...ratingIds, [providerName]: id });
    if (rate && label === rate[providerName]) {
      const { [providerName]: _, ...newRatings } = ratingIds;
      setRatingIds(newRatings);
    }
    setValues({
      ...values,
      [providerName]: referenceStore.ratings?.find((el) => el.id === id),
    });
  };

  const handleCancel = () => {
    setRatingIds({});
    setValues(initialValues);
    setDisabled(true);
  };

  const createRatingValue = useCallback(
    (type) => {
      const rate = orgsStore.getLastValueRate(type);
      if (values[type]?.ratingName) {
        return {
          value: values[type].ratingName,
          label: values[type].ratingName,
        };
      }
      if (rate) {
        return {
          value: rate[type],
          label: rate[type],
        };
      }
      return null;
    },
    [values],
  );

  return (
    <div className="position-relative p-3 h-100 w-100">
      {referenceStore.loading || orgsStore.loading ? (
        <LoadingOverlay extraClass={'bg-white'} />
      ) : (
        <>
          <Breadcrumbs
            className="mb-3"
            items={[
              { name: 'Home', href: '/admin' },
              { name: 'Organizations', href: '/admin/orgs' },
              {
                name: orgsStore.currentOrg.name,
                href: `/admin/orgs/${orgsStore.currentOrg.code}`,
              },
            ]}
          />

          <div className="mb-4">
            <h4 className="text-dark mb-1">{orgsStore.currentOrg.name}</h4>
            <h5 className="text-md">{orgsStore.currentOrg.type?.code}</h5>
          </div>

          <div className="mt-2">
            <Nav tabs>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={activeTab === '1' ? ' active' : ''}
                  onClick={() => toggleTab('1')}
                >
                  Details
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={activeTab === '2' ? ' active' : ''}
                  onClick={() => toggleTab('2')}
                >
                  Industry / Sector
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={activeTab === '3' ? ' active' : ''}
                  onClick={() => toggleTab('3')}
                >
                  Rating
                </NavLink>
              </NavItem>

              {isShowSecurities && (
                <NavItem className="cursor-pointer">
                  <NavLink
                    className={activeTab === '4' ? ' active' : ''}
                    onClick={() => toggleTab('4')}
                  >
                    Existing Securities
                  </NavLink>
                </NavItem>
              )}
            </Nav>

            <TabContent activeTab={activeTab}>
              <TabPane
                tabId="1"
                className="bg-white py-4 px-3 border border-top-0"
              >
                <div className="mb-3">
                  <label className="mb-1 text-muted">Organization Name:</label>
                  <h5 className="text-md mb-0">{orgsStore.currentOrg.name}</h5>
                </div>
                <div className="mb-3">
                  <label className="mb-1 text-muted">
                    Organization Short Name:
                  </label>
                  <h5 className="text-md mb-0">
                    {orgsStore.currentOrg.shortName}
                  </h5>
                </div>
                <div className="mb-3">
                  <label className="mb-1 text-muted">
                    Organization Ticker:
                  </label>
                  <h5 className="text-md mb-0">
                    {orgsStore.currentOrg.ticker}
                  </h5>
                </div>
                <div>
                  <label className="mb-1 text-muted">Organization Code:</label>
                  <h5 className="text-md mb-0">{orgsStore.currentOrg.code}</h5>
                </div>
              </TabPane>

              <TabPane
                tabId="2"
                className="bg-white py-4 px-3 border border-top-0 position-relative"
              >
                {(orgsStore.status === 'Setting sector' ||
                  orgsStore.status === 'Setting industry') && (
                  <LoadingOverlay />
                )}

                <div className="d-flex flex-column align-items-start w-25 mb-3">
                  <label className="mb-1 text-muted">Sector:</label>
                  <ReactSelectComponent
                    isDisabled={
                      !applicationStore.permissions.organization?.modify
                    }
                    placeholder="Select"
                    className="width-md"
                    value={
                      orgsStore.currentOrg.sector
                        ? {
                            label: orgsStore.currentOrg.sector?.name,
                            value: orgsStore.currentOrg.sector?.id,
                          }
                        : null
                    }
                    onChange={(s) => orgsStore.setOrgSector(s)}
                    options={referenceStore.sectors?.map((sector) => {
                      return {
                        label: sector.name,
                        value: sector.id,
                        ...sector,
                      };
                    })}
                  />
                </div>

                <div className="d-flex flex-column align-items-start">
                  <label className="mb-1 text-muted">Industry:</label>
                  <ReactSelectComponent
                    isDisabled={
                      !applicationStore.permissions.organization?.modify
                    }
                    className="width-md"
                    placeholder="Select"
                    value={
                      orgsStore.currentOrg.industry
                        ? {
                            label: orgsStore.currentOrg.industry.name,
                            value: orgsStore.currentOrg.industry.id,
                          }
                        : null
                    }
                    onChange={(s) => orgsStore.setOrgIndustry(s)}
                    options={referenceStore.industries?.map((industry) => {
                      return {
                        label: industry.name,
                        value: industry.code,
                        ...industry,
                      };
                    })}
                  />
                </div>
              </TabPane>

              <TabPane
                tabId="3"
                className="bg-white py-4 px-3 border border-top-0 position-relative"
              >
                {orgsStore.status === 'Changing rating' && <LoadingOverlay />}

                <Row>
                  <Col lg={2}>
                    <div className="w-100 m-0 d-flex flex-column align-items-start">
                      <label className="mb-1 text-muted">Moody's</label>
                      <ReactSelectComponent
                        isDisabled={
                          !applicationStore.permissions.organization?.modify
                        }
                        placeholder="Select"
                        className="w-100"
                        value={createRatingValue('Moody')}
                        onChange={handleEditRating}
                        options={moodyRating?.map((r) => ({
                          label: r.ratingName,
                          value: r.rank,
                          ...r,
                        }))}
                      />
                    </div>
                  </Col>
                  <Col lg={2} style={colStyleSp}>
                    <div className="w-100 d-flex flex-column align-items-start">
                      <label className="mb-1 text-muted">S&P</label>
                      <ReactSelectComponent
                        isDisabled={
                          !applicationStore.permissions.organization?.modify
                        }
                        placeholder="Select"
                        className="w-100"
                        value={createRatingValue('SpRating')}
                        onChange={handleEditRating}
                        options={spRating?.map((r) => ({
                          label: r.ratingName,
                          value: r.rank,
                          ...r,
                        }))}
                      />
                    </div>
                  </Col>
                  <Col lg={2} style={colStyleFitch}>
                    <div className="w-100 d-flex flex-column align-items-start">
                      <label className="mb-1 text-muted">Fitch</label>
                      <ReactSelectComponent
                        isDisabled={
                          !applicationStore.permissions.organization?.modify
                        }
                        placeholder="Select"
                        className="w-100"
                        value={createRatingValue('FitchRating')}
                        onChange={handleEditRating}
                        options={fitchRating?.map((r) => ({
                          label: r.ratingName,
                          value: r.rank,
                          ...r,
                        }))}
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={8}>
                    <RatingHistory
                      ratingIds={ratingIds}
                      handleCancel={handleCancel}
                      disabled={disabled}
                      setRatingIds={setRatingIds}
                    />
                  </Col>
                </Row>
              </TabPane>
              {isShowSecurities && (
                <TabPane
                  tabId="4"
                  className="bg-white py-4 px-3 border border-top-0 position-relative"
                >
                  <Row>
                    <Col lg={8}>
                      <ExistingSecurities />
                    </Col>
                  </Row>
                </TabPane>
              )}
            </TabContent>
          </div>
        </>
      )}
    </div>
  );
});

export default OrgOverview;
