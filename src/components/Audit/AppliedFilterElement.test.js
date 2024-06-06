import { render, screen } from '@testing-library/react';

import AppliedFilterElement from './AppliedFilterElement';

import { createValue } from './AppliedFilterElement';

describe('AppliedFilterElement component', () => {
  test('when render AppliedFilterElement component', () => {
    render(
      <AppliedFilterElement
        isShow={true}
        title={'Request Id'}
        type={'requestId'}
      />,
    );

    const element = screen.getByTestId('apply_filter');
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass(
      'text-sm text-secondary px-2 p-1 border bg-white m-1 d-flex align-items-center',
    );
    expect(element.children.length).toEqual(4);
  });
});

describe('Objects are not valid as a React child', () => {
  test('createValue function should return only string', () => {
    const result = createValue('dateTo');
    expect(typeof result).toEqual('string');
  });

  test(' should return only string', () => {
    const result = createValue('dateFrom');
    expect(typeof result).toEqual('string');
  });

  test('shuold be only string', () => {
    const result = createValue('requestId');
    expect(typeof result).toEqual('string');
  });

  test('shuold be only string', () => {
    const result = createValue('organization');
    expect(typeof result).toEqual('string');
  });
});
