import * as React from 'react';
import { PureComponent } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { GithubInfoModel } from '../../../api/GithubAPI';
import { widgetFactory, ExternalProps } from '../IWidget';

type IProps = ExternalProps<GithubInfoModel>;
