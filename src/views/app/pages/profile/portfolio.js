import React, { useState } from 'react';
import {
  Row,
  Card,
  CardBody,
  Nav,
  NavItem,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  TabContent,
  TabPane,
  Badge,
  CardTitle,
  CardSubtitle,
  CardText,
  CardImg,
  Label,
} from 'reactstrap';
import { Formik, Form, Field } from 'formik';
import { NavLink } from 'react-router-dom';
import classnames from 'classnames';
import Breadcrumb from '../../../../containers/navs/Breadcrumb';
import { Colxx } from '../../../../components/common/CustomBootstrap';
import IntlMessages from '../../../../helpers/IntlMessages';
import SingleLightbox from '../../../../components/pages/SingleLightbox';
import recentPostsData from '../../../../data/recentposts';
import RecentPost from '../../../../components/common/RecentPost';
import productData from '../../../../data/products';
import UserCardBasic from '../../../../components/cards/UserCardBasic';
import friendsData from '../../../../data/follow';
import { getCurrentUser, capitalize } from '../../../../helpers/Utils';
import FormGroup from 'reactstrap/lib/FormGroup';
import { gql, useMutation } from '@apollo/client';
import { AccountsClient } from '@accounts/client';

const products = productData.slice(0, 15);

const ProfilePortfolio = ({ match }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [user, setUser] = useState(getCurrentUser);
  const [editMode, setEditMode] = useState(false);
  const [about, setAbout] = useState('Your Bio is empty');
  const [location, setLocation] = useState({ country: '', city: '' });
  const [responsibilities, setResponsibilities] = useState([
    'Graphic Designer',
    'Customer Assistant',
  ]);
  const initialValues = { about, location };
  const [social] = useState({
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  });

  const [countries] = useState(['LB', 'UAE']);
  const [cities] = useState(['Beirut', 'Dubai']);

  const UPDATE_USER = gql`
    mutation UpdateUserProfileMutation($UserLocation: LocationInput) {
      updateUserProfile(location: $UserLocation) {
        user {
          location {
            country
            city
          }
        }
      }
    }
  `;
  const [updateUser] = useMutation(UPDATE_USER);

  const onSubmit = (value) => {
    toggleEditMode();
    value = { ...value, location };
    console.log(value);
    updateUser({
      variables: {
        UserLocation: value.location,
      },
    });
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <>
      <Row>
        <Colxx xxs="12">
          <h1>
            {capitalize(user.firstName) + ' ' + capitalize(user.lastName)}
          </h1>
          <div className="text-zero top-right-button-container">
            <UncontrolledDropdown>
              <DropdownToggle
                caret
                color="primary"
                size="lg"
                outline
                className="top-right-button top-right-button-single"
              >
                <IntlMessages id="pages.actions" />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem header>
                  <IntlMessages id="pages.header" />
                </DropdownItem>
                <DropdownItem disabled>
                  <IntlMessages id="pages.delete" />
                </DropdownItem>
                <DropdownItem>
                  <IntlMessages id="pages.another-action" />
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem>
                  <IntlMessages id="pages.another-action" />
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>

          <Breadcrumb match={match} />

          <Nav tabs className="separator-tabs ml-0 mb-5">
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === 'details',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('details');
                }}
                location={{}}
                to="#"
              >
                <IntlMessages id="pages.details" />
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === 'followers',
                  'nav-link': true,
                })}
                onClick={() => {
                  setActiveTab('followers');
                }}
                location={{}}
                to="#"
              >
                <IntlMessages id="pages.followers" />
              </NavLink>
            </NavItem>
          </Nav>

          <TabContent activeTab={activeTab}>
            <TabPane tabId="details">
              <Row>
                <Colxx xxs="12" lg="4" className="mb-4 col-left">
                  {editMode && (
                    <Card className="mb-4">
                      <div className="position-absolute card-top-buttons">
                        <Button
                          onClick={toggleEditMode}
                          outline
                          color="white"
                          className="icon-button"
                        >
                          <i className="simple-icon-pencil" />
                        </Button>
                      </div>
                      <SingleLightbox
                        thumb={user.img || '/assets/img/profiles/profile.jpg'}
                        large={user.lgimg || '/assets/img/profiles/profile.jpg'}
                        className="card-img-top"
                      />

                      <CardBody>
                        <Formik
                          initialValues={initialValues}
                          onSubmit={onSubmit}
                        >
                          {({ errors, touched }) => (
                            <Form>
                              <p className="text-muted text-small mb-2">
                                <IntlMessages id="menu.about" />
                              </p>
                              <FormGroup>
                                <Field className="form-control" name="about" />
                              </FormGroup>
                              <p className="text-muted text-small mb-2">
                                <IntlMessages id="pages.location" />
                              </p>
                              <FormGroup>
                                <select
                                  name="country"
                                  value={location.country}
                                  onChange={(e) =>
                                    setLocation({
                                      ...location,
                                      country: e.target.value,
                                    })
                                  }
                                  className="form-control"
                                >
                                  <option value="" label="Select a Country" />
                                  {countries.map((country) => {
                                    return (
                                      <option
                                        key={country}
                                        value={country}
                                        label={country}
                                      />
                                    );
                                  })}
                                </select>
                              </FormGroup>
                              <FormGroup>
                                <select
                                  name="city"
                                  value={location.city}
                                  onChange={(e) =>
                                    setLocation({ ...location, city: e.target.value })
                                  }
                                  className="form-control"
                                >
                                  <option value="" label="Select a City" />
                                  {cities.map((city) => {
                                    return (
                                      <option
                                        key={city}
                                        value={city}
                                        label={city}
                                      />
                                    );
                                  })}
                                </select>
                              </FormGroup>
                              <p className="text-muted text-small mb-2">
                                <IntlMessages id="pages.responsibilities" />
                              </p>
                              <p className="text-muted text-small mb-2">
                                <IntlMessages id="menu.contact" />
                              </p>
                              <div className="social-icons">
                                <ul className="list-unstyled list-inline">
                                  <li className="list-inline-item">
                                    <i className="simple-icon-social-facebook" />
                                    <FormGroup>
                                      <Field
                                        className="form-control"
                                        name="facebook"
                                      />
                                    </FormGroup>
                                  </li>
                                  <li className="list-inline-item">
                                    <i className="simple-icon-social-twitter" />
                                    <FormGroup>
                                      <Field
                                        className="form-control"
                                        name="twitter"
                                      />
                                    </FormGroup>
                                  </li>
                                  <li className="list-inline-item">
                                    <i className="simple-icon-social-instagram" />
                                    <FormGroup>
                                      <Field
                                        className="form-control"
                                        name="instagram"
                                      />
                                    </FormGroup>
                                  </li>
                                </ul>
                              </div>
                              <Button type="submit">Save</Button>
                            </Form>
                          )}
                        </Formik>
                      </CardBody>
                    </Card>
                  )}
                  {
                    !editMode && (
                      <Card className="mb-4">
                        <div className="position-absolute card-top-buttons">
                          <Button
                            onClick={toggleEditMode}
                            outline
                            color="white"
                            className="icon-button"
                          >
                            <i className="simple-icon-pencil" />
                          </Button>
                        </div>
                        <SingleLightbox
                          thumb={user.img || '/assets/img/profiles/profile.jpg'}
                          large={
                            user.lgimg || '/assets/img/profiles/profile.jpg'
                          }
                          className="card-img-top"
                        />

                        <CardBody>
                          <p className="text-muted text-small mb-2">
                            <IntlMessages id="menu.about" />
                          </p>
                          <p className="mb-3">{user.bio || about}</p>
                          <p className="text-muted text-small mb-2">
                            <IntlMessages id="pages.location" />
                          </p>
                          {user.location && (
                            <p className="mb-3">
                              {`${user.location.country}, ${user.location.city}`}
                            </p>
                          )}
                          {!user.location && (
                            <p className="mb-3">No Location</p>
                          )}
                          <p className="text-muted text-small mb-2">
                            <IntlMessages id="pages.responsibilities" />
                          </p>
                          <p className="mb-3">
                            {responsibilities.map((badge) => {
                              return (
                                <Badge
                                  color="outline-secondary"
                                  className="mb-1 mr-1"
                                  pill
                                  key={badge}
                                >
                                  {badge}
                                </Badge>
                              );
                            })}
                          </p>
                          <p className="text-muted text-small mb-2">
                            <IntlMessages id="menu.contact" />
                          </p>
                          <div className="social-icons">
                            <ul className="list-unstyled list-inline">
                              <li className="list-inline-item">
                                <NavLink to={social.facebook} location={{}}>
                                  <i className="simple-icon-social-facebook" />
                                </NavLink>
                              </li>
                              <li className="list-inline-item">
                                <NavLink to={social.twitter} location={{}}>
                                  <i className="simple-icon-social-twitter" />
                                </NavLink>
                              </li>
                              <li className="list-inline-item">
                                <NavLink to={social.instagram} location={{}}>
                                  <i className="simple-icon-social-instagram" />
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                        </CardBody>
                      </Card>
                    )

                    /* <Card className="mb-4">
                    <CardBody>
                      <CardTitle>
                        <IntlMessages id="pages.recent-posts" />
                      </CardTitle>
                      <div className="remove-last-border remove-last-margin remove-last-padding">
                        {recentPostsData.map((itemData) => {
                          return (
                            <RecentPost
                              data={itemData}
                              key={`recent_${itemData.key}`}
                            />
                          );
                        })}
                      </div>
                    </CardBody>
                  </Card> */
                  }
                </Colxx>
                {/* <Colxx xxs="12" lg="8" className="mb-4 col-right">
                  <Row>
                    {products.map((product) => {
                      return (
                        <Colxx
                          xxs="12"
                          lg="6"
                          xl="4"
                          className="mb-4"
                          key={`product_${product.id}`}
                        >
                          <Card>
                            <div className="position-relative">
                              <NavLink
                                to="#"
                                location={{}}
                                className="w-40 w-sm-100"
                              >
                                <CardImg
                                  top
                                  alt={product.title}
                                  src={product.img}
                                />
                              </NavLink>
                            </div>
                            <CardBody>
                              <NavLink
                                to="#"
                                location={{}}
                                className="w-40 w-sm-100"
                              >
                                <CardSubtitle>{product.title}</CardSubtitle>
                              </NavLink>
                              <CardText className="text-muted text-small mb-0 font-weight-light">
                                {product.createDate}
                              </CardText>
                            </CardBody>
                          </Card>
                        </Colxx>
                      );
                    })}
                  </Row>
                </Colxx>
                // */}
              </Row>
            </TabPane>
            <TabPane tabId="followers">
              {/* <Row>
                {friendsData.map((itemData) => {
                  return (
                    <Colxx
                      xxs="12"
                      md="6"
                      lg="4"
                      key={`frined_${itemData.key}`}
                    >
                      <UserCardBasic data={itemData} />
                    </Colxx>
                  );
                })}
              </Row> */}
              <Row>No Followers</Row>
            </TabPane>
          </TabContent>
        </Colxx>
      </Row>
    </>
  );
};

const stringToArray = (string) => {
  return string.trim(' ').split(',');
};
export default ProfilePortfolio;
