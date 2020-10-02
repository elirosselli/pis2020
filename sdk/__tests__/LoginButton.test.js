import React from 'react';
import { TouchableOpacity } from 'react-native';
import renderer from 'react-test-renderer';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import LoginButton from '../LoginButton';

configure({ adapter: new Adapter() });

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

  // it('test click event', async () => {
  //   const mockLinkingOpenUrl = jest.fn();
  //   jest.mock('react-native/Libraries/Linking/Linking', () => ({
  //     openURL: mockLinkingOpenUrl,
  //   }));
  //   const sdkIdUClientId = 'sdkIdUClientId';
  //   const wrapper = shallow(<LoginButton sdkIdUClientId="sdkIdUClientId" />);
  //   await wrapper.find(TouchableOpacity).simulate('press');
  //   expect(wrapper).toMatchSnapshot();
  //   expect(mockLinkingOpenUrl).toHaveBeenCalledWith(
  //     `https://auth-testing.iduruguay.gub.uy/oidc/v1/authorize?scope=openid&response_type=code&client_id=${sdkIdUClientId}&redirect_uri=sdkIdU.testing%3A%2F%2Fauth`,
  //   );
  // });
});
