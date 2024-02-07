export function generateMarkdownText({ form }) {
	let markdownText = "";
	if (form.doors === 1 && form.critical === 1 && form.security_type === 0)
		markdownText += `
## Physical Access

Solution: A more robust system and advanced management features are needed to efficiently manage a larger number of doors.
User management is becoming more complex. Advanced features such as user group management, granular permissions, and access schedules should be considered.
A centralized system with an advanced user interface is often required to effectively manage access to multiple doors from a central displacement`;

	if (form.technology === 0 && form.technology_1 === 1 && form.nfc === 0) {
		markdownText += `
## Technology Information

NFC Type A and Type B are widely compatible with many NFC reading devices and systems, making it easy to integrate into existing access security solutions.
NFC Type A offer reasonable storage capacity for storing credentials or access data, making them suitable for a variety of security applications.
In addition, outsourced storage service providers often invest in high-tech data centers
`;
	}
	if (form.permissions === 5 && form.permissions_revokation === 0 && form.permissions_revokation_recent === 0 && form.kpi_respected === 0) {
		markdownText += `
## KPI and Permissions

Solution: By adhering to KPIs, the company is more likely to comply with data security regulations and standards, such as the GDPR (General Data Protection Regulation) 
in Europe or ISO standards related to information security.
This reduces the risk of fines and regulatory penalties.
Quickly revoking badges for employees who leave the company or change roles reduces the risk of unauthorized access to facilities 

## Security History

Your company is medium-sized, with approximately X employees, and operates in the field of [insert field of activity].
This scale and industry requires a balanced approach to security to meet the specific requirements of your industry.

**Assessment of your cyber security :** Your internal cyber security assessment indicates an awareness of the importance of security, but also acknowledges potential gaps in some critical areas, including [mention identified areas for improvement].

**In-house physical security skills :** Your company has an in-house team dedicated to physical security, including trained professionals. However, further analysis will reveal the extent of their capabilities and the possible need for reinforcement or training.

**Information Security Policy :** A formal information security policy, approved by management, is in place. However, periodic updates and ongoing awareness are recommended to ensure its relevance and effectiveness to evolving threats.

**List of users and access :** We have identified processes for managing users and access on your systems, although improvements in documentation and updating access lists are needed to ensure proper governance and responsiveness to changes.
When it comes to the budget for a custom audit, it depends on several factors, including the scope of the audit, the complexity of your infrastructure, and the specific goals you want to achieve. We'd love to discuss your needs in more detail to develop an accurate budget estimate needed for a comprehensive and personalized assessment of your security.
`;

	}
	return markdownText;
}