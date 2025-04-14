import * as React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../dialog'
import { OkCancelButtonGroup } from '../dialog/ok-cancel-button-group'
import { LinkButton } from '../lib/link-button'
import { Octicon } from '../octicons'
import * as octicons from '../octicons/octicons.generated'
import { CopyButton } from '../copy-button'

export interface ISecretLocation {
  tokenDescription: string
  commitSha: string
  path: string
  lineNumber: number
  bypassURL: string
}

interface IPushProtectionErrorDialogProps {
  readonly secretLocations: ReadonlyArray<ISecretLocation>

  readonly onDismissed: () => void
}

/**
 * The dialog shown when a push is denied by GitHub's push protection feature of secret scanning.
 */
export class PushProtectionErrorDialog extends React.Component<
  IPushProtectionErrorDialogProps,
  {}
> {
  public render() {
    return (
      <Dialog
        title={
          __DARWIN__
            ? 'Push Blocked: Secret Detected'
            : 'Push blocked: secret detected'
        }
        onDismissed={this.props.onDismissed}
        onSubmit={this.props.onDismissed}
        type="error"
        role="alertdialog"
        ariaDescribedBy="push-protection-error-dialog-description"
        className="push-protection-error-dialog"
      >
        <DialogContent>
          <div id="push-protection-error-dialog-description">
            <p>
              <LinkButton uri="https://docs.github.com/code-security/secret-scanning/protecting-pushes-with-secret-scanning}">
                Secret Scanning
              </LinkButton>{' '}
              found secret(s) in the commit(s) you attempted to push.{' '}
            </p>
            <p>
              Allowing secrets risks exposure. Consider{' '}
              <LinkButton uri="https://docs.github.com/code-security/secret-scanning/working-with-secret-scanning-and-push-protection/working-with-push-protection-in-the-github-ui#resolving-a-blocked-commit">
                removing the secret from your commit and commit history.
              </LinkButton>
            </p>
            Exposing this secret can allow someone to:
            <ul>
              <li>
                Verify the identity of this GitHub Personal Access Token secret
              </li>
              <li>Know which resources this secret can access</li>
              <li>Act on behalf of the secret's owner</li>
              <li>Push this secret to this repository without being blocked</li>
            </ul>
          </div>
          <div className="secret-locations-container">
            Secret Locations:
            {this.renderLocations()}
          </div>
        </DialogContent>
        <DialogFooter>
          <OkCancelButtonGroup cancelButtonVisible={false} />
        </DialogFooter>
      </Dialog>
    )
  }

  private renderLocations = () => {
    const rows = this.props.secretLocations.map((row, index) => (
      <div key={index} className="location">
        <div className="location-header">
          <span className="location-description">{row.tokenDescription}</span>
          <span>
            <LinkButton uri={row.bypassURL}>Bypass </LinkButton>
          </span>
        </div>
        <div className="location-details">
          <div className="commit-sha">
            <Octicon symbol={octicons.gitCommit} />
            <div className="ref selectable-text">
              {row.commitSha.substring(0, 7)}
            </div>
            <CopyButton
              ariaLabel="Copy the full SHA"
              copyContent={row.commitSha}
            />
          </div>
          <div>
            <Octicon symbol={octicons.relFilePath} />
            <div className="ref selectable-text">
              {row.path} at line {row.lineNumber}
            </div>
          </div>
        </div>
      </div>
    ))
    return <div className="secret-locations">{rows}</div>
  }
}

