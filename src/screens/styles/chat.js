import { StyleSheet } from 'react-native';

import { colors, getWidthPerCent } from '../../globals';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F0F0F0',
    flex: 1,
  },
  chatList: {
    //backgroundColor: 'red',
    flex: 1,
  },
  fileImage: {
    //width: getWidthPerCent(50),
    //height: getWidthPerCent(50),
    opacity: 0.8,
  },
  messageWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  messageWrapperLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  message: {
    padding: 10,
    backgroundColor: '#fff',
    elevation: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: getWidthPerCent(80),
    minWidth: getWidthPerCent(40),
  },
  autoMessage: {
    marginVertical: 5,
    flex: 1,
  },
  autoMessageGradient: {
    paddingVertical: 5,
  },
  autoMessageText: {
    fontSize: 12,
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    //color: '#2cd07e',
  },
  autoMessageDate: {
    flex: 1,
    fontSize: 12,
    textAlign: 'center',
    //color: '#2cd07e',
    marginTop: 5,
  },
  isLoggedMessage: {
    backgroundColor: '#DCF8C6',
    //alignSelf: 'flex-end',
  },
  messageName: {
    paddingBottom: 5,
    fontWeight: 'bold',
  },
  emptyChatContainer: {
    backgroundColor: 'rgb(254, 244, 197)',
    padding: 12,
    margin: 15,
    borderColor: 'rgb(226, 218, 191)',
    borderWidth: 1,
    borderRadius: 10,
  },
  emptyChatText: {
    color: '#555',
    textAlign: 'center',
  },
  emptyChatTextSpace: {
    color: 'rgb(254, 244, 197)',
  },
  advName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  messageDateAdv: {
    paddingTop: 5,
    color: '#555',
    fontSize: 12,
    //fontWeight: 'bold',
  },
  messageDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageDate: {
    color: '#87A172',
    fontSize: 12,
    paddingRight: 5,
    //fontWeight: 'bold',
    textAlign: 'right',
    alignItems: 'center',
  },
  fileImageFull: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    width: '100%'
  },
  fileCamera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  fileImageFullContainer: {
    backgroundColor: 'rgba(0, 0, 0, .91)',
    flex: 1,
  },
  fileImageFullClose: {
    backgroundColor: 'rgba(0, 0, 0, .91)',
    alignItems: 'center',
    zIndex: 9999,
  },
  fileImageFullCloseButton: {
    top: 15,
    right: 15,
    zIndex: 9999,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, .91)',
    padding: 5,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  attachButtonBottomContainer: {
    backgroundColor: '#fff',
    borderTopColor: 'rgba(0, 0, 0, .1)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  attachModalHeader: {
    backgroundColor: colors.primary,
    height: 55,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  attachModalHeaderText: {
    color: '#fafafa',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16,
  },
  attachDescribeRow: {
    flexDirection: 'row',
    paddingTop: 7,
  },
  attachButtonWrapperLoading: {
    backgroundColor: '#fff',
    padding: 15,
    flex: 1,
  },
  audioModalContainer: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 0,
    left: 0,
    elevation: 2,
    width: getWidthPerCent(100),
    flexDirection: 'row',
    alignItems: 'center',
  },
  audioModalPlayPauseButton: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  audioModalCloseButton: {
    padding: 10,
  },
  audioDescButtonWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioDescRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioDescContainer: {
    backgroundColor: 'rgba(0, 0, 0, .1)',
    flex: 1,
    justifyContent: 'center',
  },
  audioModalText: {
    flex: 1,
    color: '#555',
  },
  attachButtonWrapper: {
    padding: 10,
    flex: 1,
  },
  attachDescribeContainer: {
    backgroundColor: 'rgba(0, 0, 0, .1)',
    padding: 15,
    flex: 1,
  },
  attachButtonWrapperContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  audioButton: {
    //padding: 3,
    marginHorizontal: 5,
  },
  audioWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  audioContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    marginBottom: 5,
  },
  attachContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderColor: 'rgba(0, 0, 0, .1)',
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    width: getWidthPerCent(70),
    marginBottom: 5,
    alignItems: 'center',
  },
  attachWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  urlPreview: {
    minWidth: getWidthPerCent(70),
    minHeight: 50,
    flex: 1,
    alignItems: 'center',
    //backgroundColor: 'rgb(196, 220, 176)',
    borderRadius: 5,
    justifyContent: 'center',
  },
  urlPreviewImage: {
    width: 100,
    height: 80,
    //backgroundColor: 'rgb(174, 196, 156)',
  },
  urlPreviewTitle: {},
  urlPreviewContainer: {
    paddingVertical: 10,
    flex: 1,
    zIndex: 5,
  },
  urlPreviewErrorText: {
    zIndex: 4,
    left: 10,
    right: 10,
    position: 'absolute',
  },
  urlPreviewTextContainer: {
    flex: 1,
    paddingLeft: 15,
    //backgroundColor: 'rgb(196, 220, 176)',
  },
  audioCounterContainer: {
    backgroundColor: '#c00',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioCounterItem: {
    flex: 1,
    backgroundColor: 'blue',
  },
  audioCounterText: {
    color: '#fafafa',
    fontWeight: 'bold',
  },
  attachText: {
    paddingLeft: 5,
    paddingBottom: 5,
    color: '#666',
    flex: 1,
  },
  attachDescribeLeft: {
    width: getWidthPerCent(20),
    textAlign: 'right',
    paddingRight: 5,
    fontWeight: 'bold',
  },
  attachDescribeRight: {
    flex: 1,
  },
  fileName: {
    flexShrink: 1
  }
});

export default styles;
