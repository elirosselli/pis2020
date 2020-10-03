import React from 'react';
import renderer from 'react-test-renderer';
import LoginButton from '../LoginButton';

describe('<LoginButton />', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<LoginButton sdkIdUClientId="sdkIdUClientId" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Expect to not log error in console', () => {
    const spy = jest.spyOn(global.console, 'error');
    renderer.create(<LoginButton sdkIdUClientId="sdkIdUClientId" />).toJSON();
    expect(spy).not.toHaveBeenCalled();
  });
});
