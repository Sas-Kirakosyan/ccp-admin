import React from 'react';
import classNames from 'classnames';

import { Input } from 'reactstrap';

import PlacesAutocomplete from 'react-places-autocomplete';

export default function AddressAutocomplete({
  address,
  handleSelect,
  handleChangeAddress,
  countryCode,
  isNotValidAddress,
}) {
  return (
    <PlacesAutocomplete
      value={address || ''}
      onChange={handleChangeAddress}
      onSelect={handleSelect}
      searchOptions={{
        componentRestrictions: { country: countryCode },
        types: ['address'],
      }}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
        suggestions.types = [
          'street_address',
          'intersection',
          'political',
          'country',
          'administrative_area_level_1',
          'administrative_area_level_2',
          'locality',
          'neighborhood',
          'postal_code',
          'room',
          'floor',
          'route',
        ];

        return (
          <>
            <Input
              {...getInputProps({
                placeholder: '',
                className: classNames('location-search-input', {
                  ' is-invalid': isNotValidAddress,
                }),
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active
                  ? 'suggestion-item--active'
                  : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };

                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    {suggestion.terms.length > 2 ? (
                      <span>{suggestion.description}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        );
      }}
    </PlacesAutocomplete>
  );
}
