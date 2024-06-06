import RadioButton from './RadioButton';

import { render, fireEvent } from '@testing-library/react';

describe('RadioButton component ', () => {
  test('render without className props', () => {
    render(<RadioButton />);

    const el = document.querySelector('.radio-checkbox-container');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('radio-checkbox-container');
  });

  test('render  with className props', () => {
    render(<RadioButton className="testName" />);

    const el = document.querySelector('.radio-checkbox-container');
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass('radio-checkbox-container testName');
  });

  test('should render Radio button and fire onChange event', () => {
    let checked = false;

    const radioHandler = jest.fn(() => {
      checked = true;
    });

    const { rerender, getByTestId } = render(
      <RadioButton onChange={radioHandler} checked={checked} name="Ticker" />,
    );

    const radio = getByTestId('radio');
    expect(radio).toBeInTheDocument();
    expect(radio).not.toBeChecked();

    fireEvent.click(radio);

    rerender(
      <RadioButton onChange={radioHandler} checked={checked} name="Ticker" />,
    );

    expect(radio).toBeChecked();
  });
});
